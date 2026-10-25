package se.felanmalan.ping;

import static org.hamcrest.Matchers.startsWith;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class PingControllerTests {

	@Autowired
	private MockMvc mockMvc;

	@Test
	void pingReadsFromTheDatabaseWithoutLogin() throws Exception {
		mockMvc.perform(get("/api/ping"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.status").value("ok"))
			.andExpect(jsonPath("$.database").value(startsWith("PostgreSQL")))
			.andExpect(jsonPath("$.users").isNumber());
	}

	@Test
	void otherEndpointsRequireLogin() throws Exception {
		mockMvc.perform(get("/api/tickets")).andExpect(status().isUnauthorized());
	}

}
