package se.felanmalan.property;

import jakarta.validation.constraints.NotBlank;

public record CreatePropertyRequest(
        @NotBlank(message = "Namn måste anges")
        String name,

        @NotBlank(message = "Adress måste anges")
        String address
) {
}