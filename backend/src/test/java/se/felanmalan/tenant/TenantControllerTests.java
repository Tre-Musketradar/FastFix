package se.felanmalan.tenant;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.transaction.annotation.Transactional;

import se.felanmalan.auth.TokenService;
import se.felanmalan.property.Apartment;
import se.felanmalan.property.ApartmentRepository;
import se.felanmalan.property.Property;
import se.felanmalan.property.PropertyRepository;
import se.felanmalan.user.User;
import se.felanmalan.user.UserRepository;

// Story 4 mot riktig databas. Testet skapar egna användare, fastigheter och lägenheter,
// så det beror inte på testdata.sql. @Transactional rullar tillbaka allt.
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class TenantControllerTests {

    @Autowired MockMvc mvc;
    @Autowired TokenService tokens;
    @Autowired UserRepository users;
    @Autowired PropertyRepository properties;
    @Autowired ApartmentRepository apartments;
    @Autowired JdbcTemplate jdbc;

    private User manager;
    private User existingTenant;
    private Apartment free;
    private Apartment occupied;

    @BeforeEach
    void createManagerWithApartments() {
        manager = newUser("Testförvaltare", "MANAGER");
        existingTenant = newUser("Befintlig hyresgäst", "TENANT");
        Property property = newProperty(manager, "Testfastigheten", "Testgatan 1");
        free = apartments.saveAndFlush(new Apartment(property.getId(), "1001", 1));
        occupied = new Apartment(property.getId(), "1002", 1);
        occupied.setTenantId(existingTenant.getId());
        occupied = apartments.saveAndFlush(occupied);
    }

    @Test
    void managerAddsTenantWhoCanLogInAndSeeTheirApartment() throws Exception {
        String email = UUID.randomUUID() + "@example.test";
        create(manager, body("Anna Andersson", email.toUpperCase(), free.getId()))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Anna Andersson"))
                .andExpect(jsonPath("$.email").value(email))
                .andExpect(jsonPath("$.apartmentId").value(free.getId()));

        mvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"" + email + "\",\"password\":\"hemligt123\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user.role").value("TENANT"));

        User tenant = users.findByEmail(email).orElseThrow();
        mvc.perform(get("/api/tenants/me/apartment").header("Authorization", bearer(tenant)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(free.getId()))
                .andExpect(jsonPath("$.propertyName").value("Testfastigheten"))
                .andExpect(jsonPath("$.propertyAddress").value("Testgatan 1"))
                .andExpect(jsonPath("$.number").value("1001"));
    }

    @Test
    void conflictsExplainWhatIsWrong() throws Exception {
        create(manager, body("Ny", existingTenant.getEmail(), free.getId()))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("E-postadressen används redan."));
        create(manager, body("Ny", UUID.randomUUID() + "@example.test", occupied.getId()))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("Lägenheten har redan en hyresgäst."));
        assertThat(jdbc.queryForObject("select tenant_id from apartments where id = ?", Long.class, free.getId()))
                .isNull();
    }

    @Test
    void apartmentInSomeoneElsesPropertyIsNotFound() throws Exception {
        User otherManager = newUser("Annan förvaltare", "MANAGER");
        Apartment other = apartments.saveAndFlush(
                new Apartment(newProperty(otherManager, "Annans", "Annangatan 2").getId(), "2001", 2));

        create(manager, body("Ny", UUID.randomUUID() + "@example.test", other.getId()))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Lägenheten hittades inte."));
    }

    @Test
    void missingFieldsAreBadRequest() throws Exception {
        create(manager, "{}").andExpect(status().isBadRequest());
        create(manager, body("Ny", "inte-en-adress", free.getId())).andExpect(status().isBadRequest());
    }

    @Test
    void onlyManagersCanAddTenants() throws Exception {
        String body = body("Ny", UUID.randomUUID() + "@example.test", free.getId());
        create(existingTenant, body).andExpect(status().isForbidden());
        create(newUser("Testtekniker", "TECHNICIAN"), body).andExpect(status().isForbidden());
        mvc.perform(post("/api/tenants").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void availableApartmentsAreFreeAndInOwnProperties() throws Exception {
        User otherManager = newUser("Annan förvaltare", "MANAGER");
        apartments.saveAndFlush(new Apartment(newProperty(otherManager, "Annans", "Annangatan 2").getId(), "2001", 2));

        mvc.perform(get("/api/tenants/available-apartments").header("Authorization", bearer(manager)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].id").value(free.getId()))
                .andExpect(jsonPath("$[0].propertyName").value("Testfastigheten"))
                .andExpect(jsonPath("$[0].number").value("1001"))
                .andExpect(jsonPath("$[0].floor").value(1));

        mvc.perform(get("/api/tenants/available-apartments").header("Authorization", bearer(existingTenant)))
                .andExpect(status().isForbidden());
    }

    @Test
    void tenantWithoutApartmentGetsNotFound() throws Exception {
        mvc.perform(get("/api/tenants/me/apartment")
                .header("Authorization", bearer(newUser("Utan lägenhet", "TENANT"))))
                .andExpect(status().isNotFound());
        mvc.perform(get("/api/tenants/me/apartment").header("Authorization", bearer(manager)))
                .andExpect(status().isForbidden());
    }

    private ResultActions create(User user, String body) throws Exception {
        return mvc.perform(post("/api/tenants")
                .header("Authorization", bearer(user))
                .contentType(MediaType.APPLICATION_JSON)
                .content(body));
    }

    private static String body(String name, String email, Long apartmentId) {
        return """
                {"name":"%s","email":"%s","password":"hemligt123","apartmentId":%d}
                """.formatted(name, email, apartmentId);
    }

    private String bearer(User user) {
        return "Bearer " + tokens.createToken(user);
    }

    private Property newProperty(User owner, String name, String address) {
        Property property = new Property(name, address);
        property.setOwnerId(owner.getId());
        return properties.saveAndFlush(property);
    }

    // Ny användare med samma lösenordshash som seed-teknikern.
    private User newUser(String name, String role) {
        Long id = jdbc.queryForObject("""
            insert into users (name, email, password_hash, role)
            select ?, ?, password_hash, ?::user_role
            from users where email = 'tekniker@felanmalan.se' returning id
            """, Long.class, name, UUID.randomUUID() + "@example.test", role);
        return users.findById(id).orElseThrow();
    }
}
