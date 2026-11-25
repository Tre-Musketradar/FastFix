package se.felanmalan.tenant;

import se.felanmalan.user.User;

public record TenantResponse(Long id, String name, String email, Long apartmentId) {

    static TenantResponse from(User user, Long apartmentId) {
        return new TenantResponse(user.getId(), user.getName(), user.getEmail(), apartmentId);
    }
}
