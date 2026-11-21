package se.felanmalan.ticket;

import jakarta.validation.constraints.NotNull;

public record AssignTechnicianRequest(
        @NotNull(message = "Välj en tekniker") Long technicianId
) {
}
