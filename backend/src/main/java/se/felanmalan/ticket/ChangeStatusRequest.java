package se.felanmalan.ticket;

import jakarta.validation.constraints.NotNull;

public record ChangeStatusRequest(
        @NotNull(message = "Välj en status") TicketStatus status
) {
}
