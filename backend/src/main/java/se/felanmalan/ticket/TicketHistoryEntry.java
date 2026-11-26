package se.felanmalan.ticket;

import java.time.OffsetDateTime;

/** En registrerad statusändring, inklusive tid och användaren som utförde den. */
public record TicketHistoryEntry(
        Long id,
        TicketStatus oldStatus,
        TicketStatus newStatus,
        Long changedById,
        String changedByName,
        OffsetDateTime changedAt) {
}
