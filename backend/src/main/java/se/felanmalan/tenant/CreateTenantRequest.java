package se.felanmalan.tenant;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateTenantRequest(
        @NotBlank(message = "Namn måste anges")
        @Size(max = 100, message = "Namnet får vara högst 100 tecken")
        String name,

        @NotBlank(message = "E-postadress måste anges")
        @Email(message = "Ogiltig e-postadress")
        String email,

        @NotBlank(message = "Lösenord måste anges")
        @Size(min = 8, message = "Lösenordet måste vara minst 8 tecken")
        String password,

        @NotNull(message = "Lägenhet måste anges")
        Long apartmentId
) {
}
