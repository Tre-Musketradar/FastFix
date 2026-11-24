package se.felanmalan.ticket;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

// Statusflödet för tekniker enligt docs/frontend-plan.md.
class TicketStatusServiceTests {

    @Test
    void allowsTheTechnicianFlow() {
        assertThat(TicketStatusService.technicianMayChange(TicketStatus.ASSIGNED, TicketStatus.IN_PROGRESS)).isTrue();
        assertThat(TicketStatusService.technicianMayChange(TicketStatus.IN_PROGRESS, TicketStatus.WAITING)).isTrue();
        assertThat(TicketStatusService.technicianMayChange(TicketStatus.WAITING, TicketStatus.IN_PROGRESS)).isTrue();
        assertThat(TicketStatusService.technicianMayChange(TicketStatus.IN_PROGRESS, TicketStatus.RESOLVED)).isTrue();
    }

    @Test
    void rejectsEverythingElse() {
        for (TicketStatus from : TicketStatus.values()) {
            for (TicketStatus to : TicketStatus.values()) {
                boolean allowed = (from == TicketStatus.ASSIGNED && to == TicketStatus.IN_PROGRESS)
                        || (from == TicketStatus.IN_PROGRESS && to == TicketStatus.WAITING)
                        || (from == TicketStatus.WAITING && to == TicketStatus.IN_PROGRESS)
                        || (from == TicketStatus.IN_PROGRESS && to == TicketStatus.RESOLVED);
                assertThat(TicketStatusService.technicianMayChange(from, to))
                        .as(from + " → " + to).isEqualTo(allowed);
            }
        }
    }
}
