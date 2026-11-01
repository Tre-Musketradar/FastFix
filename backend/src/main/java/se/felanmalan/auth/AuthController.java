package se.felanmalan.auth;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import se.felanmalan.user.UserRepository;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	private final UserRepository users;

	public AuthController(UserRepository users) {
		this.users = users;
	}

	/** Den inloggade användaren. Frontend använder den efter omladdning för att se att token fortfarande gäller. */
	@GetMapping("/me")
	public UserResponse me(@AuthenticationPrincipal Jwt jwt) {
		return users.findById(Long.valueOf(jwt.getSubject()))
			.map(UserResponse::from)
			// Användaren kan ha tagits bort efter att token skapades
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
	}

}
