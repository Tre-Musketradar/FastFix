package se.felanmalan.ticket;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import se.felanmalan.auth.TokenService;
import se.felanmalan.property.Apartment;
import se.felanmalan.property.ApartmentRepository;
import se.felanmalan.property.Property;
import se.felanmalan.property.PropertyRepository;
import se.felanmalan.user.Role;
import se.felanmalan.user.User;
import se.felanmalan.user.UserRepository;

/** Verifierar historik, ordning och åtkomst för alla tre roller mot PostgreSQL. */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class TicketHistoryControllerTests {

    @Autowired MockMvc mvc;
    @Autowired TokenService tokens;
    @Autowired JdbcTemplate jdbc;
    @Autowired UserRepository users;
    @Autowired PropertyRepository properties;
    @Autowired ApartmentRepository apartments;
    @Autowired TicketRepository tickets;

    private User tenant;
    private User technician;
    private User manager;
    private Ticket ticket;

    @BeforeEach
    void setup() {
        manager = newUser("Förvaltare Historia", Role.MANAGER);
        tenant = newUser("Hyresgäst Historia", Role.TENANT);
        technician = newUser("Tekniker Historia", Role.TECHNICIAN);

        Property property = new Property("Historiafastigheten", "Testvägen 1");
        property.setOwnerId(manager.getId());
        property = properties.saveAndFlush(property);

        Apartment apartment = apartments.saveAndFlush(new Apartment(property.getId(), "1001", 1));
        jdbc.update("update apartments set tenant_id = ? where id = ?", tenant.getId(), apartment.getId());

        ticket = new Ticket(apartment.getId(), tenant.getId(), TicketCategory.PLUMBING, "Kranen läcker");
        ticket.assignTechnician(technician.getId());
        ticket = tickets.saveAndFlush(ticket);
    }

    @Test
    void everyRoleSeesSameHistoryInChronologicalOrder() throws Exception {
        // Spara i omvänd tidsordning: tjänsten måste sortera på changed_at, inte ID.
        addHistory("IN_PROGRESS", "WAITING", technician, "2026-11-20T10:00:00Z");
        addHistory("NEW", "ASSIGNED", manager, "2026-11-20T08:00:00Z");
        addHistory("ASSIGNED", "IN_PROGRESS", technician, "2026-11-20T09:00:00Z");

        for (User viewer : new User[] { tenant, technician, manager }) {
            mvc.perform(get("/api/tickets/{id}/history", ticket.getId())
                    .header("Authorization", bearer(viewer)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.length()").value(3))
                    .andExpect(jsonPath("$[0].oldStatus").value("NEW"))
                    .andExpect(jsonPath("$[0].newStatus").value("ASSIGNED"))
                    .andExpect(jsonPath("$[0].changedByName").value("Förvaltare Historia"))
                    .andExpect(jsonPath("$[0].changedById").value(manager.getId().intValue()))
                    .andExpect(jsonPath("$[0].changedAt").isNotEmpty())
                    .andExpect(jsonPath("$[1].newStatus").value("IN_PROGRESS"))
                    .andExpect(jsonPath("$[1].changedByName").value("Tekniker Historia"))
                    .andExpect(jsonPath("$[2].newStatus").value("WAITING"));
        }
    }

    @Test
    void emptyHistoryReturnsEmptyList() throws Exception {
        mvc.perform(get("/api/tickets/{id}/history", ticket.getId())
                .header("Authorization", bearer(tenant)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void usersCannotSeeOthersTickets() throws Exception {
        User otherTenant = newUser("Annan hyresgäst", Role.TENANT);
        User otherTechnician = newUser("Annan tekniker", Role.TECHNICIAN);
        User otherManager = newUser("Annan förvaltare", Role.MANAGER);

        for (User viewer : new User[] { otherTenant, otherTechnician, otherManager }) {
            mvc.perform(get("/api/tickets/{id}/history", ticket.getId())
                    .header("Authorization", bearer(viewer)))
                    .andExpect(status().isNotFound());
        }
    }

    @Test
    void unknownTicketReturnsNotFoundAndAnonymousReturnsUnauthorized() throws Exception {
        mvc.perform(get("/api/tickets/{id}/history", Long.MAX_VALUE)
                .header("Authorization", bearer(manager)))
                .andExpect(status().isNotFound());
        mvc.perform(get("/api/tickets/{id}/history", ticket.getId()))
                .andExpect(status().isUnauthorized());
    }

    private void addHistory(String oldStatus, String newStatus, User actor, String when) {
        jdbc.update("""
                insert into status_history (ticket_id, old_status, new_status, changed_by, changed_at)
                values (?, ?::ticket_status, ?::ticket_status, ?, ?::timestamptz)
                """, ticket.getId(), oldStatus, newStatus, actor.getId(), when);
    }

    private User newUser(String name, Role role) {
        Long id = jdbc.queryForObject("""
                insert into users (name, email, password_hash, role)
                values (?, ?, 'test-only-hash', ?::user_role)
                returning id
                """, Long.class, name, UUID.randomUUID() + "@example.test", role.name());
        return users.findById(id).orElseThrow();
    }

    private String bearer(User user) {
        return "Bearer " + tokens.createToken(user);
    }
}
