package se.felanmalan.auth;

import se.felanmalan.user.Role;
import se.felanmalan.user.User;

/** Användaren som frontend får, utan lösenord. */
public record UserResponse(Long id, String name, String email, Role role) {

	static UserResponse from(User user) {
		return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole());
	}

}
