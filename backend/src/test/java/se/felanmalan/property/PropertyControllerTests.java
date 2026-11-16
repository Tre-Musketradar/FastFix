package se.felanmalan.property;

import static org.hamcrest.Matchers.hasSize;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.transaction.annotation.Transactional;

import se.felanmalan.auth.TokenService;
import se.felanmalan.user.User;
import se.felanmalan.user.UserRepository;

// @Transactional: varje test rullas tillbaka, så databasen är som förut efteråt
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class PropertyControllerTests {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private TokenService tokens;

	@Autowired
	private UserRepository users;

	@Autowired
	private PropertyRepository properties;

	@Test
	void withoutTokenGives401() throws Exception {
		mockMvc.perform(get("/api/properties")).andExpect(status().isUnauthorized());
		create(null, "{\"name\":\"Tallen 3\",\"address\":\"Tallgatan 3\"}").andExpect(status().isUnauthorized());
	}

	@ParameterizedTest
	@ValueSource(strings = { "hyresgast@felanmalan.se", "tekniker@felanmalan.se" })
	void tenantsAndTechniciansGet403(String email) throws Exception {
		String token = tokenFor(email);

		mockMvc.perform(get("/api/properties").header("Authorization", "Bearer " + token))
			.andExpect(status().isForbidden());
		create(token, "{\"name\":\"Tallen 3\",\"address\":\"Tallgatan 3\"}").andExpect(status().isForbidden());
	}

	@Test
	void managerCreatesAPropertyThatShowsUpFirstInTheList() throws Exception {
		User manager = users.findByEmail("forvaltare@felanmalan.se").orElseThrow();
		String token = tokens.createToken(manager);

		create(token, "{\"name\":\"  Tallen 3 \",\"address\":\" Tallgatan 3  \"}")
			.andExpect(status().isCreated())
			.andExpect(jsonPath("$.id").isNumber())
			.andExpect(jsonPath("$.name").value("Tallen 3"))
			.andExpect(jsonPath("$.address").value("Tallgatan 3"))
			.andExpect(jsonPath("$.ownerId").value(manager.getId()));

		mockMvc.perform(get("/api/properties").header("Authorization", "Bearer " + token))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$[0].name").value("Tallen 3"));
	}

	@Test
	void theListOnlyShowsTheManagersOwnProperties() throws Exception {
		User manager = users.findByEmail("forvaltare@felanmalan.se").orElseThrow();
		long own = properties.findByOwnerIdOrderByIdDesc(manager.getId()).size();
		Property someoneElses = new Property("Annans fastighet", "Annangatan 1");
		someoneElses.setOwnerId(users.findByEmail("tekniker@felanmalan.se").orElseThrow().getId());
		properties.save(someoneElses);

		mockMvc.perform(get("/api/properties").header("Authorization", "Bearer " + tokens.createToken(manager)))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$", hasSize((int) own)));
	}

	@ParameterizedTest
	@ValueSource(strings = { "{\"name\":\"\",\"address\":\"Tallgatan 3\"}", "{\"name\":\"Tallen 3\",\"address\":\"  \"}",
			"{\"name\":\"Tallen 3\"}", "{}" })
	void missingNameOrAddressGives400AndSavesNothing(String body) throws Exception {
		long before = properties.count();

		create(tokenFor("forvaltare@felanmalan.se"), body).andExpect(status().isBadRequest());

		assertEquals(before, properties.count());
	}

	@Test
	void tooLongNameGives400() throws Exception {
		String name = "a".repeat(101);

		create(tokenFor("forvaltare@felanmalan.se"), "{\"name\":\"" + name + "\",\"address\":\"Tallgatan 3\"}")
			.andExpect(status().isBadRequest());
	}

	private String tokenFor(String email) {
		return tokens.createToken(users.findByEmail(email).orElseThrow());
	}

	private ResultActions create(String token, String body) throws Exception {
		var request = post("/api/properties").contentType(MediaType.APPLICATION_JSON).content(body);
		if (token != null) {
			request.header("Authorization", "Bearer " + token);
		}
		return mockMvc.perform(request);
	}

}
