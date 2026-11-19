package se.felanmalan.ticket;

import java.util.List;

import org.springframework.stereotype.Service;

import se.felanmalan.property.ApartmentRepository;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final ApartmentRepository apartmentRepository;

    public TicketService(TicketRepository ticketRepository, ApartmentRepository apartmentRepository) {
        this.ticketRepository = ticketRepository;
        this.apartmentRepository = apartmentRepository;
    }

    // Hyresgästen ser bara ärenden för sin egen lägenhet, nyaste först.
    // Utan lägenhet finns inga ärenden att visa, så då blir listan tom.
    public List<Ticket> listMyTickets(Long tenantId) {
        return apartmentRepository.findByTenantId(tenantId)
                .map(apartment -> ticketRepository.findByApartmentIdOrderByCreatedAtDescIdDesc(apartment.getId()))
                .orElse(List.of());
    }
}
