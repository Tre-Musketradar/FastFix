package se.felanmalan.ticket;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.OffsetDateTime;
import java.util.List;
import org.junit.jupiter.api.Test;
import se.felanmalan.property.ApartmentRepository;

class ManagerOpenTicketServiceTests {

    @Test
    void returnsManagerOpenTicketsUsingRepositoryFilter() {
        TicketRepository tickets = mock(TicketRepository.class);
        TicketService service = new TicketService(tickets, mock(ApartmentRepository.class));
        ManagerOpenTicketResponse item = new ManagerOpenTicketResponse(
                5L, 1L, "Solrosen", 2L, "1001",
                TicketCategory.PLUMBING, TicketPriority.NORMAL, TicketStatus.NEW,
                "Droppande kran", null, null, OffsetDateTime.now()
        );
        when(tickets.findOpenForManager(1L, TicketStatus.CLOSED, TicketStatus.NEW))
                .thenReturn(List.of(item));

        assertThat(service.listOpenForManager(1L)).containsExactly(item);
        verify(tickets).findOpenForManager(1L, TicketStatus.CLOSED, TicketStatus.NEW);
    }
}
