package se.felanmalan.tenants;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateTenantDTO(
        @NotBlank(message = "Namn är obligatoriskt")
        @Size(min = 2, max = 100, message = "Namn måste vara mellan 2 och 100 tecken")
        String name,

        @NotBlank(message = "E-post är obligatoriskt")
        @Email(message = "Ange en giltig e-postadress")
        String email,

        @NotBlank(message = "Lösenord är obligatoriskt")
        @Size(min = 8, message = "Lösenord måste vara minst 8 tecken")
        String password,

        Long apartmentId
) {}
