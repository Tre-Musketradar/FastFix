package se.felanmalan.ticket;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.util.ReflectionTestUtils;
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

// Förvaltaren stänger ett åtgärdat ärende (story 13) mot riktig databas. Testet skapar
// egna användare, fastighet och lägenhet, så det beror inte på testdata.sql.
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class TicketCloseControllerTests {

    @Autowired MockMvc mvc;
    @Autowired TokenService tokens;
    @Autowired UserRepository users;
    @Autowired PropertyRepository properties;
    @Autowired ApartmentRepository apartments;
    @Autowired TicketRepository tickets;
    @Autowired JdbcTemplate jdbc;

    private User manager;
    private User technician;
    private User tenant;
    private Apartment apartment;

    @BeforeEach
    void createUsersAndApartment() {
        manager = newUser("Testförvaltare", "MANAGER");
        technician = newUser("Testtekniker", "TECHNICIAN");
        tenant = newUser("Testhyresgäst", "TENANT");
        apartment = newApartment(manager);
        jdbc.update("update apartments set tenant_id = ? where id = ?", tenant.getId(), apartment.getId());
    }

    @Test
    void managerClosesResolvedTicket() throws Exception {
        Ticket ticket = ticket(apartment, TicketStatus.RESOLVED);

        close(manager, ticket)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(ticket.getId()))
                .andExpect(jsonPath("$.status").value("CLOSED"));

        Ticket saved = tickets.findById(ticket.getId()).orElseThrow();
        assertThat(saved.getStatus()).isEqualTo(TicketStatus.CLOSED);
        assertThat(saved.getClosedAt()).isNotNull();

        var history = jdbc.queryForList("""
                select old_status::text as old_status, new_status::text as new_status, changed_by
                from status_history where ticket_id = ?
                """, ticket.getId());
        assertThat(history).singleElement().satisfies(row -> {
            assertThat(row.get("old_status")).isEqualTo("RESOLVED");
            assertThat(row.get("new_status")).isEqualTo("CLOSED");
            assertThat(row.get("changed_by")).isEqualTo(manager.getId());
        });
    }

    @Test
    void closedTicketDisappearsFromOpenListAndTenantSeesItClosed() throws Exception {
        Ticket ticket = ticket(apartment, TicketStatus.RESOLVED);
        close(manager, ticket).andExpect(status().isOk());

        mvc.perform(get("/api/tickets/open").header("Authorization", bearer(manager)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.id == " + ticket.getId() + ")]").isEmpty());

        mvc.perform(get("/api/tickets/mine").header("Authorization", bearer(tenant)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.id == " + ticket.getId() + ")].status").value("CLOSED"))
                .andExpect(jsonPath("$[?(@.id == " + ticket.getId() + ")].closedAt").isNotEmpty());
    }

    @Test
    void onlyResolvedTicketsCanBeClosed() throws Exception {
        for (TicketStatus status : new TicketStatus[]{TicketStatus.NEW, TicketStatus.ASSIGNED,
                TicketStatus.IN_PROGRESS, TicketStatus.WAITING, TicketStatus.CLOSED}) {
            Ticket ticket = ticket(apartment, status);
            close(manager, ticket).andExpect(status().isConflict());
            assertThat(tickets.findById(ticket.getId()).orElseThrow().getStatus()).isEqualTo(status);
        }
    }

    @Test
    void managerCannotCloseTicketInSomeoneElsesProperty() throws Exception {
        User otherManager = newUser("Annan förvaltare", "MANAGER");
        Ticket ticket = ticket(newApartment(otherManager), TicketStatus.RESOLVED);

        close(manager, ticket).andExpect(status().isNotFound());
        assertThat(tickets.findById(ticket.getId()).orElseThrow().getStatus()).isEqualTo(TicketStatus.RESOLVED);
    }

    @Test
    void tenantAndTechnicianCannotClose() throws Exception {
        Ticket ticket = ticket(apartment, TicketStatus.RESOLVED);
        close(tenant, ticket).andExpect(status().isForbidden());
        close(technician, ticket).andExpect(status().isForbidden());
    }

    @Test
    void anonymousRequestIsUnauthorized() throws Exception {
        Ticket ticket = ticket(apartment, TicketStatus.RESOLVED);
        mvc.perform(patch("/api/tickets/{id}/close", ticket.getId()))
                .andExpect(status().isUnauthorized());
    }

    private ResultActions close(User user, Ticket ticket) throws Exception {
        return mvc.perform(patch("/api/tickets/{id}/close", ticket.getId())
                .header("Authorization", bearer(user)));
    }

    private String bearer(User user) {
        return "Bearer " + tokens.createToken(user);
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

    private Apartment newApartment(User owner) {
        Property property = new Property("Testfastigheten", "Testgatan 1");
        property.setOwnerId(owner.getId());
        property = properties.saveAndFlush(property);
        return apartments.saveAndFlush(new Apartment(property.getId(), "1001", 1));
    }

    private Ticket ticket(Apartment apartment, TicketStatus status) {
        Ticket ticket = new Ticket(apartment.getId(), tenant.getId(), TicketCategory.PLUMBING, "Kranen droppar");
        ReflectionTestUtils.setField(ticket, "assignedTo", technician.getId());
        ReflectionTestUtils.setField(ticket, "status", status);
        return tickets.saveAndFlush(ticket);
    }
}
