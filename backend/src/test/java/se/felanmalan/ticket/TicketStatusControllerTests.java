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
import org.springframework.http.MediaType;
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

// Teknikerns statusändring (story 11) mot riktig databas. Testet skapar egna
// användare, fastighet och lägenhet, så det beror inte på testdata.sql.
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class TicketStatusControllerTests {

    @Autowired MockMvc mvc;
    @Autowired TokenService tokens;
    @Autowired UserRepository users;
    @Autowired PropertyRepository properties;
    @Autowired ApartmentRepository apartments;
    @Autowired TicketRepository tickets;
    @Autowired JdbcTemplate jdbc;

    private User technician;
    private User tenant;
    private User manager;
    private Apartment apartment;

    @BeforeEach
    void createUsersAndApartment() {
        technician = newUser("Testtekniker", "TECHNICIAN");
        tenant = newUser("Testhyresgäst", "TENANT");
        manager = newUser("Testförvaltare", "MANAGER");
        Property property = new Property("Testfastigheten", "Testgatan 1");
        property.setOwnerId(manager.getId());
        property = properties.saveAndFlush(property);
        apartment = apartments.saveAndFlush(new Apartment(property.getId(), "1001", 1));
        jdbc.update("update apartments set tenant_id = ? where id = ?", tenant.getId(), apartment.getId());
    }

    @Test
    void technicianStartsWaitsAndResolvesTheirTicket() throws Exception {
        Ticket ticket = ticket(technician, TicketStatus.ASSIGNED);

        changeStatus(technician, ticket, "IN_PROGRESS")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(ticket.getId()))
                .andExpect(jsonPath("$.status").value("IN_PROGRESS"));
        changeStatus(technician, ticket, "WAITING").andExpect(status().isOk());
        changeStatus(technician, ticket, "IN_PROGRESS").andExpect(status().isOk());
        changeStatus(technician, ticket, "RESOLVED")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("RESOLVED"));

        // Varje ändring blir en rad i historiken, med teknikern som ändrade.
        var history = jdbc.queryForList("""
                select old_status::text as old_status, new_status::text as new_status, changed_by
                from status_history where ticket_id = ? order by id
                """, ticket.getId());
        assertThat(history).extracting(row -> row.get("old_status") + "→" + row.get("new_status"))
                .containsExactly("ASSIGNED→IN_PROGRESS", "IN_PROGRESS→WAITING",
                        "WAITING→IN_PROGRESS", "IN_PROGRESS→RESOLVED");
        assertThat(history).allSatisfy(row -> assertThat(row.get("changed_by")).isEqualTo(technician.getId()));
    }

    @Test
    void tenantSeesTheNewStatus() throws Exception {
        Ticket ticket = ticket(technician, TicketStatus.ASSIGNED);
        changeStatus(technician, ticket, "IN_PROGRESS").andExpect(status().isOk());

        mvc.perform(get("/api/tickets/mine").header("Authorization", bearer(tenant)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.id == " + ticket.getId() + ")].status").value("IN_PROGRESS"));
    }

    @Test
    void technicianCannotChangeSomeoneElsesTicket() throws Exception {
        User otherTechnician = newUser("Annan tekniker", "TECHNICIAN");
        Ticket ticket = ticket(otherTechnician, TicketStatus.ASSIGNED);

        changeStatus(technician, ticket, "IN_PROGRESS").andExpect(status().isNotFound());
        assertThat(tickets.findById(ticket.getId()).orElseThrow().getStatus()).isEqualTo(TicketStatus.ASSIGNED);
    }

    @Test
    void transitionsOutsideTheFlowAreRejected() throws Exception {
        changeStatus(technician, ticket(technician, TicketStatus.ASSIGNED), "RESOLVED")
                .andExpect(status().isConflict());
        changeStatus(technician, ticket(technician, TicketStatus.IN_PROGRESS), "CLOSED")
                .andExpect(status().isConflict());
        changeStatus(technician, ticket(technician, TicketStatus.RESOLVED), "IN_PROGRESS")
                .andExpect(status().isConflict());
        changeStatus(technician, ticket(technician, TicketStatus.IN_PROGRESS), "IN_PROGRESS")
                .andExpect(status().isConflict());
    }

    @Test
    void missingOrUnknownStatusIsBadRequest() throws Exception {
        Ticket ticket = ticket(technician, TicketStatus.ASSIGNED);
        mvc.perform(patch("/api/tickets/{id}/status", ticket.getId())
                .header("Authorization", bearer(technician))
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isBadRequest());
        changeStatus(technician, ticket, "FIXED").andExpect(status().isBadRequest());
    }

    @Test
    void tenantAndManagerCannotChangeStatus() throws Exception {
        Ticket ticket = ticket(technician, TicketStatus.ASSIGNED);
        changeStatus(tenant, ticket, "IN_PROGRESS").andExpect(status().isForbidden());
        changeStatus(manager, ticket, "IN_PROGRESS").andExpect(status().isForbidden());
    }

    @Test
    void anonymousRequestIsUnauthorized() throws Exception {
        Ticket ticket = ticket(technician, TicketStatus.ASSIGNED);
        mvc.perform(patch("/api/tickets/{id}/status", ticket.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"status\":\"IN_PROGRESS\"}"))
                .andExpect(status().isUnauthorized());
    }

    private ResultActions changeStatus(User user, Ticket ticket, String newStatus) throws Exception {
        return mvc.perform(patch("/api/tickets/{id}/status", ticket.getId())
                .header("Authorization", bearer(user))
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"status\":\"" + newStatus + "\"}"));
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

    private Ticket ticket(User assignedTo, TicketStatus status) {
        Ticket ticket = new Ticket(apartment.getId(), tenant.getId(), TicketCategory.PLUMBING, "Kranen droppar");
        ReflectionTestUtils.setField(ticket, "assignedTo", assignedTo.getId());
        ReflectionTestUtils.setField(ticket, "status", status);
        return tickets.saveAndFlush(ticket);
    }
}
