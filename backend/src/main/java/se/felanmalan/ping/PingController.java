package se.felanmalan.ping;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Testendpoint från projektskelettet: visar att frontend når backend
 * och att backend kan läsa från databasen.
 */
@RestController
public class PingController {

	private final JdbcTemplate jdbc;

	public PingController(JdbcTemplate jdbc) {
		this.jdbc = jdbc;
	}

	@GetMapping("/api/ping")
	public PingResponse ping() {
		String database = jdbc.queryForObject("SELECT 'PostgreSQL ' || current_setting('server_version')", String.class);
		Long users = jdbc.queryForObject("SELECT count(*) FROM users", Long.class);
		return new PingResponse("ok", database, users);
	}

	public record PingResponse(String status, String database, Long users) {
	}

}
