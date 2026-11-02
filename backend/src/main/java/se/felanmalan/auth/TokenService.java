package se.felanmalan.auth;

import java.time.Duration;
import java.time.Instant;

import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import se.felanmalan.user.User;

/**
 * Skapar token (JWT) för en inloggad användare. Innehållet står i
 * docs/sprintar/sprint-1/plan-story-1.md, avsnittet API-kontraktet.
 */
@Service
public class TokenService {

	static final Duration VALID_FOR = Duration.ofHours(8);

	private final JwtEncoder encoder;

	public TokenService(JwtEncoder encoder) {
		this.encoder = encoder;
	}

	public String createToken(User user) {
		Instant now = Instant.now();
		JwtClaimsSet claims = JwtClaimsSet.builder()
			.subject(user.getId().toString())
			.issuedAt(now)
			.expiresAt(now.plus(VALID_FOR))
			.claim("email", user.getEmail())
			.claim("name", user.getName())
			.claim("role", user.getRole().name())
			.build();
		JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
		return encoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
	}

}
