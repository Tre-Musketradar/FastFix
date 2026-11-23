package se.felanmalan.ticket;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import se.felanmalan.auth.TokenService;
import se.felanmalan.property.Apartment;
import se.felanmalan.property.ApartmentRepository;
import se.felanmalan.user.User;
import se.felanmalan.user.UserRepository;

// Mot riktig databas: kontrollerar att PostgreSQL-enumarna läses rätt och att bara hyresgäster släpps in.
// @Transactional rullar tillbaka ärendena som testerna sparar.
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class TicketControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private TokenService tokens;

    @Autowired
    private UserRepository users;

    @Autowired
    private ApartmentRepository apartments;

    @Autowired
    private TicketRepository tickets;

    @Test
    void tenantSeesTicketsForTheirApartmentNewestFirst() throws Exception {
        User tenant = users.findByEmail("hyresgast@felanmalan.se").orElseThrow();
        Apartment apartment = apartments.findByTenantId(tenant.getId()).orElseThrow();
        Ticket older = tickets.saveAndFlush(
                new Ticket(apartment.getId(), tenant.getId(), TicketCategory.PLUMBING, "Droppande kran"));
        Ticket newer = tickets.saveAndFlush(
                new Ticket(apartment.getId(), tenant.getId(), TicketCategory.LOCKS_DOORS, "Dörren går inte att låsa"));

        mockMvc.perform(get("/api/tickets/mine").header("Authorization", "Bearer " + tokens.createToken(tenant)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(newer.getId()))
                .andExpect(jsonPath("$[0].category").value("LOCKS_DOORS"))
                .andExpect(jsonPath("$[0].status").value("NEW"))
                .andExpect(jsonPath("$[0].createdAt").exists())
                .andExpect(jsonPath("$[1].id").value(older.getId()));
    }

    @Test
    void managerGets403() throws Exception {
        User manager = users.findByEmail("forvaltare@felanmalan.se").orElseThrow();

        mockMvc.perform(get("/api/tickets/mine").header("Authorization", "Bearer " + tokens.createToken(manager)))
                .andExpect(status().isForbidden());
    }

    @Test
    void technicianGets403() throws Exception {
        User technician = users.findByEmail("tekniker@felanmalan.se").orElseThrow();

        mockMvc.perform(get("/api/tickets/mine").header("Authorization", "Bearer " + tokens.createToken(technician)))
                .andExpect(status().isForbidden());
    }

    @Test
    void withoutTokenGives401() throws Exception {
        mockMvc.perform(get("/api/tickets/mine")).andExpect(status().isUnauthorized());
    }
}
