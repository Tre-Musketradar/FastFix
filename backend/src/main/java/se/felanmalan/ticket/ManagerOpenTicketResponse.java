package se.felanmalan.ticket;

import java.time.OffsetDateTime;

/** Sammanfattning av ett öppet ärende för förvaltarens översikt (story #17). */
public record ManagerOpenTicketResponse(
        Long id,
        Long propertyId,
        String propertyName,
        Long apartmentId,
        String apartmentNumber,
        TicketCategory category,
        TicketPriority priority,
        TicketStatus status,
        String description,
        Long assignedTo,
        String assignedTechnicianName,
        OffsetDateTime createdAt
) {
}
