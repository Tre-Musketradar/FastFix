package se.felanmalan.ticket;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import se.felanmalan.user.Role;
import se.felanmalan.user.User;
import se.felanmalan.user.UserRepository;

@Service
public class TicketAssignmentService {

    private final TicketRepository tickets;
    private final UserRepository users;
    private final JdbcTemplate jdbc;

    public TicketAssignmentService(TicketRepository tickets, UserRepository users, JdbcTemplate jdbc) {
        this.tickets = tickets;
        this.users = users;
        this.jdbc = jdbc;
    }

    @Transactional(readOnly = true)
    public List<TechnicianOption> listTechnicians() {
        return users.findByRoleOrderByNameAsc(Role.TECHNICIAN).stream()
                .map(user -> new TechnicianOption(user.getId(), user.getName()))
                .toList();
    }

    @Transactional
    public TicketAssignmentResponse assign(Long managerId, Long ticketId, Long technicianId) {
        // Kolla ägarskap direkt i SQL-frågan: ingen åtkomst till andras ärenden.
        Ticket ticket = tickets.findForManagerAssignment(ticketId, managerId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Ärendet hittades inte"));

        if (ticket.getStatus() == TicketStatus.CLOSED) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Stängda ärenden kan inte tilldelas");
        }

        User technician = users.findById(technicianId)
                .filter(user -> user.getRole() == Role.TECHNICIAN)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Välj en giltig tekniker"));

        TicketStatus oldStatus = ticket.getStatus();
        ticket.assignTechnician(technician.getId());
        tickets.saveAndFlush(ticket);

        // Registrera en statusändring, men inte en historikrad vid byte av
        // tekniker om ärendet redan har status ASSIGNED.
        if (oldStatus != TicketStatus.ASSIGNED) {
            jdbc.update("""
                    insert into status_history (ticket_id, old_status, new_status, changed_by)
                    values (?, CAST(? AS ticket_status), CAST(? AS ticket_status), ?)
                    """, ticket.getId(), oldStatus.name(), TicketStatus.ASSIGNED.name(), managerId);
        }

        return new TicketAssignmentResponse(
                ticket.getId(), technician.getId(), technician.getName(), ticket.getStatus());
    }
}
