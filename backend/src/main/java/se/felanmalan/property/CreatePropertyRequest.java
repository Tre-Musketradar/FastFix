package se.felanmalan.property;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreatePropertyRequest(
        @NotBlank(message = "Namn måste anges")
        @Size(max = 100, message = "Namnet får vara högst 100 tecken")
        String name,

        @NotBlank(message = "Adress måste anges")
        @Size(max = 255, message = "Adressen får vara högst 255 tecken")
        String address
) {
}
