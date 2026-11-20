package se.felanmalan.tenants;

import se.felanmalan.UserRole;

// For presenting tenant data (response)
public record TenantResponseDto(
        Long id,
        String name,
        String email,
        UserRole role
) {}
