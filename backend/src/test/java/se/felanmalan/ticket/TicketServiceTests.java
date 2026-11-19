package se.felanmalan.ticket;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import se.felanmalan.property.Apartment;
import se.felanmalan.property.ApartmentRepository;

class TicketServiceTests {

    private TicketRepository tickets;
    private ApartmentRepository apartments;
    private TicketService service;

    @BeforeEach
    void setUp() {
        tickets = mock(TicketRepository.class);
        apartments = mock(ApartmentRepository.class);
        service = new TicketService(tickets, apartments);
    }

    @Test
    void listsTicketsForTheTenantsOwnApartment() {
        Apartment apartment = mock(Apartment.class);
        when(apartment.getId()).thenReturn(5L);
        when(apartments.findByTenantId(3L)).thenReturn(Optional.of(apartment));
        Ticket ticket = new Ticket(5L, 3L, TicketCategory.PLUMBING, "Droppande kran");
        when(tickets.findByApartmentIdOrderByCreatedAtDescIdDesc(5L)).thenReturn(List.of(ticket));

        assertThat(service.listMyTickets(3L)).containsExactly(ticket);
        verify(tickets).findByApartmentIdOrderByCreatedAtDescIdDesc(5L);
    }

    @Test
    void tenantWithoutApartmentGetsAnEmptyList() {
        when(apartments.findByTenantId(3L)).thenReturn(Optional.empty());

        assertThat(service.listMyTickets(3L)).isEmpty();
        verify(tickets, never()).findByApartmentIdOrderByCreatedAtDescIdDesc(any());
    }
}
