package se.felanmalan.ticket;

import java.time.OffsetDateTime;

/** Ett ärende i teknikerns lista (story #19), med adress och huvudnyckel. */
public record TechnicianTicketResponse(
        Long id,
        String propertyName,
        String propertyAddress,
        String apartmentNumber,
        Integer floor,
        TicketCategory category,
        TicketPriority priority,
        TicketStatus status,
        String description,
        boolean masterKeyAllowed,
        OffsetDateTime createdAt
) {
}
