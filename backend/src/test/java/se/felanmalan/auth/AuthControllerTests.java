package se.felanmalan.auth;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.nio.charset.StandardCharsets;
import java.time.Instant;

import javax.crypto.spec.SecretKeySpec;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.test.web.servlet.MockMvc;

import com.nimbusds.jose.jwk.source.ImmutableSecret;

import se.felanmalan.user.User;
import se.felanmalan.user.UserRepository;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTests {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private TokenService tokens;

	@Autowired
	private JwtEncoder encoder;

	@Autowired
	private UserRepository users;

	@Test
	void meWithoutTokenGives401() throws Exception {
		mockMvc.perform(get("/api/auth/me")).andExpect(status().isUnauthorized());
	}

	@Test
	void meWithTokenGivesTheUserWithoutPassword() throws Exception {
		User tenant = users.findByEmail("hyresgast@felanmalan.se").orElseThrow();

		mockMvc.perform(get("/api/auth/me").header("Authorization", "Bearer " + tokens.createToken(tenant)))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.id").value(tenant.getId()))
			.andExpect(jsonPath("$.name").value("Anna Karlsson"))
			.andExpect(jsonPath("$.email").value("hyresgast@felanmalan.se"))
			.andExpect(jsonPath("$.role").value("TENANT"))
			.andExpect(jsonPath("$.passwordHash").doesNotExist());
	}

	@Test
	void anExpiredTokenGives401() throws Exception {
		User tenant = users.findByEmail("hyresgast@felanmalan.se").orElseThrow();
		Instant nineHoursAgo = Instant.now().minusSeconds(9 * 60 * 60);
		String expired = sign(encoder, JwtClaimsSet.builder()
			.subject(tenant.getId().toString())
			.issuedAt(nineHoursAgo)
			.expiresAt(nineHoursAgo.plusSeconds(8 * 60 * 60))
			.claim("role", "TENANT")
			.build());

		mockMvc.perform(get("/api/auth/me").header("Authorization", "Bearer " + expired))
			.andExpect(status().isUnauthorized());
	}

	@Test
	void aTokenSignedWithAnotherSecretGives401() throws Exception {
		JwtEncoder otherSecret = new NimbusJwtEncoder(new ImmutableSecret<>(new SecretKeySpec(
				"en-helt-annan-hemlighet-pa-minst-32-tecken".getBytes(StandardCharsets.UTF_8), "HmacSHA256")));
		String forged = sign(otherSecret, JwtClaimsSet.builder()
			.subject("1")
			.expiresAt(Instant.now().plusSeconds(60))
			.claim("role", "MANAGER")
			.build());

		mockMvc.perform(get("/api/auth/me").header("Authorization", "Bearer " + forged))
			.andExpect(status().isUnauthorized());
	}

	private static String sign(JwtEncoder encoder, JwtClaimsSet claims) {
		JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
		return encoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
	}

}
