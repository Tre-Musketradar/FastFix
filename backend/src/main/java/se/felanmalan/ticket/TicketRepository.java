package se.felanmalan.ticket;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByApartmentIdOrderByCreatedAtDescIdDesc(Long apartmentId);

    // Förena ärende, lägenhet, fastighet och eventuell tekniker direkt i databasen.
    // Begränsa listan till förvaltarens fastigheter, dölj CLOSED och visa NEW först.
    @Query("""
            select new se.felanmalan.ticket.ManagerOpenTicketResponse(
                t.id, p.id, p.name, a.id, a.number,
                t.category, t.priority, t.status, t.description,
                t.assignedTo, technician.name, t.createdAt
            )
            from Ticket t
            join Apartment a on a.id = t.apartmentId
            join Property p on p.id = a.propertyId
            left join User technician on technician.id = t.assignedTo
            where p.ownerId = :managerId
              and t.status <> :closed
            order by case when t.status = :newStatus then 0 else 1 end,
                     t.createdAt desc, t.id desc
            """)
    List<ManagerOpenTicketResponse> findOpenForManager(
            @Param("managerId") Long managerId,
            @Param("closed") TicketStatus closed,
            @Param("newStatus") TicketStatus newStatus
    );
}
