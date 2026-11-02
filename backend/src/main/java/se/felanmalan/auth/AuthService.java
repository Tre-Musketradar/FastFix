package se.felanmalan.auth;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import se.felanmalan.user.UserRepository;

@Service
public class AuthService {

	private final UserRepository users;
	private final PasswordEncoder passwordEncoder;
	private final TokenService tokens;

	public AuthService(UserRepository users, PasswordEncoder passwordEncoder, TokenService tokens) {
		this.users = users;
		this.passwordEncoder = passwordEncoder;
		this.tokens = tokens;
	}

	/**
	 * Tomt svar om e-posten inte finns eller lösenordet är fel. Anroparen får inte veta vilket
	 * (kriterium 3 i story 1).
	 */
	public Optional<LoginResponse> login(String email, String password) {
		return users.findByEmail(email.trim().toLowerCase())
			.filter(user -> passwordEncoder.matches(password, user.getPasswordHash()))
			.map(user -> new LoginResponse(tokens.createToken(user), UserResponse.from(user)));
	}

}
