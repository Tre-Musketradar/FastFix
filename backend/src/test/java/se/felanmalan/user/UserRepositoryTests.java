package se.felanmalan.user;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class UserRepositoryTests {

	@Autowired
	private UserRepository users;

	@Test
	void findsTheTenantFromTheSeedMigration() {
		User tenant = users.findByEmail("hyresgast@felanmalan.se").orElseThrow();

		assertThat(tenant.getName()).isEqualTo("Anna Karlsson");
		assertThat(tenant.getRole()).isEqualTo(Role.TENANT);
		assertThat(tenant.getPasswordHash()).startsWith("$2a$");
	}

	@Test
	void readsEveryRoleFromThePostgresEnum() {
		assertThat(users.findByEmail("forvaltare@felanmalan.se").orElseThrow().getRole()).isEqualTo(Role.MANAGER);
		assertThat(users.findByEmail("tekniker@felanmalan.se").orElseThrow().getRole()).isEqualTo(Role.TECHNICIAN);
	}

	@Test
	void returnsNothingForAnUnknownEmail() {
		assertThat(users.findByEmail("finns.inte@felanmalan.se")).isEmpty();
	}

}
