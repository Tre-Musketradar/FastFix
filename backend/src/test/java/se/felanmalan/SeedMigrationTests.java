package se.felanmalan;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootTest
class SeedMigrationTests {

	@Autowired
	private JdbcTemplate jdbc;

	@Test
	void thereIsOneTestUserPerRole() {
		assertThat(roleOf("forvaltare@felanmalan.se")).isEqualTo("MANAGER");
		assertThat(roleOf("tekniker@felanmalan.se")).isEqualTo("TECHNICIAN");
		assertThat(roleOf("hyresgast@felanmalan.se")).isEqualTo("TENANT");
	}

	@Test
	void theTestPasswordIsTest1234() {
		String hash = jdbc.queryForObject(
				"SELECT password_hash FROM users WHERE email = 'forvaltare@felanmalan.se'", String.class);

		assertThat(new BCryptPasswordEncoder().matches("test1234", hash)).isTrue();
	}

	@Test
	void theTenantLivesInSolrosen1001() {
		String apartment = jdbc.queryForObject("""
				SELECT p.name || ' ' || a.number
				FROM apartments a
				JOIN properties p ON p.id = a.property_id
				JOIN users u ON u.id = a.tenant_id
				WHERE u.email = 'hyresgast@felanmalan.se'
				""", String.class);

		assertThat(apartment).isEqualTo("Solrosen 1001");
	}

	private String roleOf(String email) {
		return jdbc.queryForObject("SELECT role::text FROM users WHERE email = ?", String.class, email);
	}

}
