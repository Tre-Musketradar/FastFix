package se.felanmalan.ticket;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import se.felanmalan.user.Role;

@Service
public class TicketHistoryService {

    private final JdbcTemplate jdbc;

    public TicketHistoryService(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Transactional(readOnly = true)
    public List<TicketHistoryEntry> historyFor(Long ticketId, Long userId, Role role) {
        // Kontrollera åtkomsten innan historiken hämtas. Samma regler som de befintliga
        // ärendelistorna: hyresgästens lägenhet, tilldelad tekniker eller fastighetens ägare.
        // Returnera 404 även för andras ärenden, så att vi inte avslöjar att de finns.
        Boolean allowed = jdbc.queryForObject("""
                select exists (
                    select 1
                    from tickets t
                    join apartments a on a.id = t.apartment_id
                    join properties p on p.id = a.property_id
                    where t.id = ?
                      and ((? = 'TENANT' and a.tenant_id = ?)
                        or (? = 'TECHNICIAN' and t.assigned_to = ?)
                        or (? = 'MANAGER' and p.owner_id = ?))
                )
                """, Boolean.class,
                ticketId, role.name(), userId, role.name(), userId, role.name(), userId);

        if (!Boolean.TRUE.equals(allowed)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Ärendet hittades inte");
        }

        // status_history används redan av tilldelning, statusändring och stängning.
        // Ordna efter tid och därefter ID om två ändringar har samma tidsstämpel.
        return jdbc.query("""
                select h.id, h.old_status::text as old_status,
                       h.new_status::text as new_status,
                       h.changed_by, u.name as changed_by_name, h.changed_at
                from status_history h
                join users u on u.id = h.changed_by
                where h.ticket_id = ?
                order by h.changed_at asc, h.id asc
                """, (rs, rowNum) -> {
                    String oldStatus = rs.getString("old_status");
                    return new TicketHistoryEntry(
                            rs.getLong("id"),
                            oldStatus == null ? null : TicketStatus.valueOf(oldStatus),
                            TicketStatus.valueOf(rs.getString("new_status")),
                            rs.getLong("changed_by"),
                            rs.getString("changed_by_name"),
                            rs.getObject("changed_at", java.time.OffsetDateTime.class));
                }, ticketId);
    }
}
