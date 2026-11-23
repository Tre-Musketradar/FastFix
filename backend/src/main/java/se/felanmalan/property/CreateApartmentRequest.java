package se.felanmalan.property;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateApartmentRequest(
        @NotBlank(message = "Lägenhetsnummer måste anges")
        @Size(max = 20, message = "Lägenhetsnumret får vara högst 20 tecken")
        String number,
        Integer floor
) {
}
