package se.felanmalan.auth;

import static org.hamcrest.Matchers.emptyString;
import static org.hamcrest.Matchers.not;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import com.jayway.jsonpath.JsonPath;

@SpringBootTest
@AutoConfigureMockMvc
class LoginTests {

	private static final String WRONG = "{\"message\":\"Fel e-post eller lösenord\"}";

	@Autowired
	private MockMvc mockMvc;

	@ParameterizedTest
	@CsvSource({
		"forvaltare@felanmalan.se, Maria Lindqvist, MANAGER",
		"tekniker@felanmalan.se, Ali Hassan, TECHNICIAN",
		"hyresgast@felanmalan.se, Anna Karlsson, TENANT"
	})
	void everyRoleCanLogIn(String email, String name, String role) throws Exception {
		login(email, "test1234")
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.token").value(not(emptyString())))
			.andExpect(jsonPath("$.user.email").value(email))
			.andExpect(jsonPath("$.user.name").value(name))
			.andExpect(jsonPath("$.user.role").value(role))
			.andExpect(jsonPath("$.user.passwordHash").doesNotExist());
	}

	@Test
	void theTokenFromLoginWorksForMe() throws Exception {
		String body = login("tekniker@felanmalan.se", "test1234").andReturn().getResponse().getContentAsString();
		String token = JsonPath.read(body, "$.token");

		mockMvc.perform(get("/api/auth/me").header("Authorization", "Bearer " + token))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.role").value("TECHNICIAN"));
	}

	@Test
	void wrongPasswordAndUnknownEmailGiveTheSameAnswer() throws Exception {
		login("forvaltare@felanmalan.se", "fel-losenord")
			.andExpect(status().isUnauthorized())
			.andExpect(content().json(WRONG, true));
		login("finns.inte@felanmalan.se", "test1234")
			.andExpect(status().isUnauthorized())
			.andExpect(content().json(WRONG, true));
	}

	@Test
	void emailIsNotCaseSensitive() throws Exception {
		login(" Forvaltare@Felanmalan.se ", "test1234").andExpect(status().isOk());
	}

	@Test
	void emptyFieldsGive400() throws Exception {
		login("", "").andExpect(status().isBadRequest());
	}

	@Test
	void anOldTokenInTheBrowserDoesNotStopLogin() throws Exception {
		mockMvc.perform(post("/api/auth/login")
				.header("Authorization", "Bearer gammal.utgangen.token")
				.contentType(MediaType.APPLICATION_JSON)
				.content(json("hyresgast@felanmalan.se", "test1234")))
			.andExpect(status().isOk());
	}

	private ResultActions login(String email, String password) throws Exception {
		return mockMvc.perform(post("/api/auth/login")
			.contentType(MediaType.APPLICATION_JSON)
			.content(json(email, password)));
	}

	private static String json(String email, String password) {
		return "{\"email\":\"" + email + "\",\"password\":\"" + password + "\"}";
	}

}
