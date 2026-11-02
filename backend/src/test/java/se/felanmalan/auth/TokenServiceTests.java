package se.felanmalan.auth;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Duration;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;

import se.felanmalan.user.User;
import se.felanmalan.user.UserRepository;

@SpringBootTest
class TokenServiceTests {

	@Autowired
	private TokenService tokens;

	@Autowired
	private JwtDecoder decoder;

	@Autowired
	private JwtAuthenticationConverter converter;

	@Autowired
	private UserRepository users;

	@Test
	void theTokenContainsTheUserAndIsValidForEightHours() {
		User tenant = users.findByEmail("hyresgast@felanmalan.se").orElseThrow();

		Jwt jwt = decoder.decode(tokens.createToken(tenant));

		assertThat(jwt.getSubject()).isEqualTo(tenant.getId().toString());
		assertThat(jwt.getClaimAsString("email")).isEqualTo("hyresgast@felanmalan.se");
		assertThat(jwt.getClaimAsString("name")).isEqualTo("Anna Karlsson");
		assertThat(jwt.getClaimAsString("role")).isEqualTo("TENANT");
		assertThat(Duration.between(jwt.getIssuedAt(), jwt.getExpiresAt())).isEqualTo(Duration.ofHours(8));
	}

	@Test
	void theRoleClaimBecomesASpringRole() {
		User manager = users.findByEmail("forvaltare@felanmalan.se").orElseThrow();

		Jwt jwt = decoder.decode(tokens.createToken(manager));

		// Spring Security 7 lägger också till FACTOR_BEARER (inloggad med token), därför bara rollerna här
		assertThat(converter.convert(jwt).getAuthorities())
			.extracting(GrantedAuthority::getAuthority)
			.filteredOn(authority -> authority.startsWith("ROLE_"))
			.containsExactly("ROLE_MANAGER");
	}

}
