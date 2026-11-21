package se.felanmalan.ticket;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.time.OffsetDateTime;
import java.util.List;
import org.junit.jupiter.api.Test;
import se.felanmalan.property.ApartmentRepository;

class TechnicianTicketServiceTests {

    @Test
    void hidesResolvedAndClosedTickets() {
        TicketRepository tickets = mock(TicketRepository.class);
        TicketService service = new TicketService(tickets, mock(ApartmentRepository.class));
        TechnicianTicketResponse item = new TechnicianTicketResponse(
                7L, "Solrosen", "Solrosvägen 1", "1001", 1,
                TicketCategory.ELECTRICAL, TicketPriority.HIGH, TicketStatus.ASSIGNED,
                "Lampan blinkar", true, OffsetDateTime.now());
        when(tickets.findAssignedToTechnician(3L, List.of(TicketStatus.RESOLVED, TicketStatus.CLOSED)))
                .thenReturn(List.of(item));

        assertThat(service.listAssignedToTechnician(3L)).containsExactly(item);
    }
}
