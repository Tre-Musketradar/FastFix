package se.felanmalan.auth;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import se.felanmalan.user.UserRepository;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	private final AuthService authService;
	private final UserRepository users;

	public AuthController(AuthService authService, UserRepository users) {
		this.authService = authService;
		this.users = users;
	}

	/** Samma 401-svar oavsett om e-posten eller lösenordet är fel. */
	@PostMapping("/login")
	public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
		return authService.login(request.email(), request.password())
			.<ResponseEntity<?>>map(ResponseEntity::ok)
			.orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
				.body(new MessageResponse("Fel e-post eller lösenord")));
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
