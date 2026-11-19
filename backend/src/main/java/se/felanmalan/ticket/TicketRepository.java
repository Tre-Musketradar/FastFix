package se.felanmalan.ticket;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByApartmentIdOrderByCreatedAtDescIdDesc(Long apartmentId);
}
