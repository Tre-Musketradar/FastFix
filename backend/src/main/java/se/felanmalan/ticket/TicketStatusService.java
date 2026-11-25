package se.felanmalan.ticket;

import java.util.Map;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

// Statusändringar. Flödet följer docs/frontend-plan.md:
// teknikern (story 11): Tilldelad → Pågår, Pågår ⇄ Väntar, Pågår → Åtgärdad;
// förvaltaren (story 13): Åtgärdad → Stängd.
@Service
public class TicketStatusService {

    private static final Map<TicketStatus, Set<TicketStatus>> TECHNICIAN_TRANSITIONS = Map.of(
            TicketStatus.ASSIGNED, Set.of(TicketStatus.IN_PROGRESS),
            TicketStatus.IN_PROGRESS, Set.of(TicketStatus.WAITING, TicketStatus.RESOLVED),
            TicketStatus.WAITING, Set.of(TicketStatus.IN_PROGRESS));

    private final TicketRepository tickets;
    private final JdbcTemplate jdbc;

    public TicketStatusService(TicketRepository tickets, JdbcTemplate jdbc) {
        this.tickets = tickets;
        this.jdbc = jdbc;
    }

    static boolean technicianMayChange(TicketStatus from, TicketStatus to) {
        return TECHNICIAN_TRANSITIONS.getOrDefault(from, Set.of()).contains(to);
    }

    @Transactional
    public TicketStatusResponse changeStatusAsTechnician(Long technicianId, Long ticketId, TicketStatus newStatus) {
        // Bara ärenden som är tilldelade teknikern. Andras ärenden syns inte (404, som vid tilldelning).
        Ticket ticket = tickets.findByIdAndAssignedTo(ticketId, technicianId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Ärendet hittades inte"));

        TicketStatus oldStatus = ticket.getStatus();
        if (!technicianMayChange(oldStatus, newStatus)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Statusen kan inte ändras så");
        }

        ticket.changeStatus(newStatus);
        tickets.saveAndFlush(ticket);
        saveHistory(ticket, oldStatus, technicianId);

        return new TicketStatusResponse(ticket.getId(), ticket.getStatus());
    }

    @Transactional
    public TicketStatusResponse closeAsManager(Long managerId, Long ticketId) {
        // Bara ärenden i förvaltarens egna fastigheter (404 annars, som vid tilldelning).
        Ticket ticket = tickets.findForManagerAssignment(ticketId, managerId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Ärendet hittades inte"));

        TicketStatus oldStatus = ticket.getStatus();
        if (oldStatus != TicketStatus.RESOLVED) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Bara åtgärdade ärenden kan stängas");
        }

        ticket.close();
        tickets.saveAndFlush(ticket);
        saveHistory(ticket, oldStatus, managerId);

        return new TicketStatusResponse(ticket.getId(), ticket.getStatus());
    }

    private void saveHistory(Ticket ticket, TicketStatus oldStatus, Long changedBy) {
        jdbc.update("""
                insert into status_history (ticket_id, old_status, new_status, changed_by)
                values (?, CAST(? AS ticket_status), CAST(? AS ticket_status), ?)
                """, ticket.getId(), oldStatus.name(), ticket.getStatus().name(), changedBy);
    }
}
