package se.felanmalan.config;

import java.nio.charset.StandardCharsets;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

import com.nimbusds.jose.jwk.source.ImmutableSecret;

/**
 * Inloggning med JWT (beslut #8). Alla anrop kräver en token i headern
 * {@code Authorization: Bearer <token>}, utom endpoints som öppnas här (en rad per endpoint).
 * Behörighet per roll skrivs i controllern med {@code @PreAuthorize("hasRole('MANAGER')")}.
 */
@Configuration
@EnableMethodSecurity
public class SecurityConfig {

	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationConverter jwtAuthenticationConverter)
			throws Exception {
		http
			.authorizeHttpRequests(auth -> auth
				.requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
				.requestMatchers("/api/ping", "/actuator/health").permitAll()
				.requestMatchers("/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
				.anyRequest().authenticated())
			.oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter)))
			// Ingen session och inga cookies: token skickas i varje anrop, därför behövs inget CSRF-skydd
			.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
			.csrf(AbstractHttpConfigurer::disable);
		return http.build();
	}

	/** Claimet {@code role} i token blir {@code ROLE_TENANT}, {@code ROLE_TECHNICIAN} eller {@code ROLE_MANAGER}. */
	@Bean
	JwtAuthenticationConverter jwtAuthenticationConverter() {
		JwtGrantedAuthoritiesConverter authorities = new JwtGrantedAuthoritiesConverter();
		authorities.setAuthoritiesClaimName("role");
		authorities.setAuthorityPrefix("ROLE_");

		JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
		converter.setJwtGrantedAuthoritiesConverter(authorities);
		return converter;
	}

	@Bean
	JwtEncoder jwtEncoder(@Value("${app.jwt-secret}") String secret) {
		return new NimbusJwtEncoder(new ImmutableSecret<>(secretKey(secret)));
	}

	@Bean
	JwtDecoder jwtDecoder(@Value("${app.jwt-secret}") String secret) {
		return NimbusJwtDecoder.withSecretKey(secretKey(secret)).macAlgorithm(MacAlgorithm.HS256).build();
	}

	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	private static SecretKey secretKey(String secret) {
		byte[] bytes = secret.getBytes(StandardCharsets.UTF_8);
		if (bytes.length < 32) {
			throw new IllegalStateException("JWT_SECRET måste vara minst 32 tecken (HS256)");
		}
		return new SecretKeySpec(bytes, "HmacSHA256");
	}

}
