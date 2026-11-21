package se.felanmalan.ticket;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.UUID;

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
import se.felanmalan.user.User;
import se.felanmalan.user.UserRepository;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class TicketAssignmentControllerTests {

    @Autowired MockMvc mvc;
    @Autowired TokenService tokens;
    @Autowired UserRepository users;
    @Autowired PropertyRepository properties;
    @Autowired ApartmentRepository apartments;
    @Autowired TicketRepository tickets;
    @Autowired JdbcTemplate jdbc;
    @Autowired jakarta.persistence.EntityManager entityManager;

    private User manager() {
        return users.findByEmail("forvaltare@felanmalan.se").orElseThrow();
    }

    private User technician() {
        return users.findByEmail("tekniker@felanmalan.se").orElseThrow();
    }

    private Ticket createTicket() {
        Property property = properties.findByOwnerIdOrderByIdDesc(manager().getId()).getFirst();
        Apartment apartment = apartments.findByPropertyIdOrderByIdDesc(property.getId()).getFirst();
        return tickets.saveAndFlush(new Ticket(apartment.getId(),
                users.findByEmail("hyresgast@felanmalan.se").orElseThrow().getId(),
                TicketCategory.PLUMBING, "Vattenläcka"));
    }

    @Test
    void managerCanAssignTechnicianAndTechnicianSeesTicketAndHistoryIsWritten() throws Exception {
        Ticket ticket = createTicket();
        User manager = manager();
        User technician = technician();

        mvc.perform(get("/api/tickets/technicians")
                .header("Authorization", "Bearer " + tokens.createToken(manager)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(technician.getId()))
                .andExpect(jsonPath("$[0].name").value(technician.getName()));

        mvc.perform(patch("/api/tickets/{id}/assign", ticket.getId())
                .header("Authorization", "Bearer " + tokens.createToken(manager))
                .contentType("application/json")
                .content("{\"technicianId\":" + technician.getId() + "}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ASSIGNED"))
                .andExpect(jsonPath("$.assignedTo").value(technician.getId()))
                .andExpect(jsonPath("$.assignedTechnicianName").value(technician.getName()));

        mvc.perform(get("/api/tickets/assigned")
                .header("Authorization", "Bearer " + tokens.createToken(technician)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(ticket.getId()))
                .andExpect(jsonPath("$[0].status").value("ASSIGNED"));

        mvc.perform(get("/api/tickets/open")
                .header("Authorization", "Bearer " + tokens.createToken(manager)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].status").value("ASSIGNED"))
                .andExpect(jsonPath("$[0].assignedTechnicianName").value(technician.getName()));

        Integer historyCount = jdbc.queryForObject(
                "select count(*) from status_history where ticket_id = ? and new_status = 'ASSIGNED'",
                Integer.class, ticket.getId());
        org.assertj.core.api.Assertions.assertThat(historyCount).isEqualTo(1);
    }

    @Test
    void managerCannotAssignTenantOrNonexistentTechnicianOrBlankRequest() throws Exception {
        Ticket ticket = createTicket();
        String bearer = "Bearer " + tokens.createToken(manager());
        Long tenantId = users.findByEmail("hyresgast@felanmalan.se").orElseThrow().getId();

        mvc.perform(patch("/api/tickets/{id}/assign", ticket.getId())
                .header("Authorization", bearer)
                .contentType("application/json")
                .content("{\"technicianId\":" + tenantId + "}"))
                .andExpect(status().isBadRequest());
        mvc.perform(patch("/api/tickets/{id}/assign", ticket.getId())
                .header("Authorization", bearer)
                .contentType("application/json")
                .content("{}"))
                .andExpect(status().isBadRequest());
        org.assertj.core.api.Assertions.assertThat(tickets.findById(ticket.getId()).orElseThrow().getStatus())
                .isEqualTo(TicketStatus.NEW);
    }

    @Test
    void noOneExceptManagerCanAssign() throws Exception {
        Ticket ticket = createTicket();
        for (String email : new String[]{"hyresgast@felanmalan.se", "tekniker@felanmalan.se"}) {
            User actor = users.findByEmail(email).orElseThrow();
            mvc.perform(patch("/api/tickets/{id}/assign", ticket.getId())
                    .header("Authorization", "Bearer " + tokens.createToken(actor))
                    .contentType("application/json")
                    .content("{\"technicianId\":" + technician().getId() + "}"))
                    .andExpect(status().isForbidden());
        }
        mvc.perform(patch("/api/tickets/{id}/assign", ticket.getId())
                .contentType("application/json")
                .content("{\"technicianId\":" + technician().getId() + "}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void managerCannotAssignTicketsInOtherManagersProperties() throws Exception {
        Long ownerId = jdbc.queryForObject("""
                insert into users (name, email, password_hash, role)
                select 'Annan förvaltare', ?, password_hash, 'MANAGER'::user_role
                from users where id = ? returning id
                """, Long.class, UUID.randomUUID() + "@example.test", manager().getId());
        Property other = new Property("Huset", "Okänd gata");
        other.setOwnerId(ownerId);
        other = properties.saveAndFlush(other);
        Apartment apt = apartments.saveAndFlush(new Apartment(other.getId(), "9999", null));
        Ticket ticket = tickets.saveAndFlush(new Ticket(apt.getId(), manager().getId(),
                TicketCategory.OTHER, "Hemma hos annan förvaltare"));

        mvc.perform(patch("/api/tickets/{id}/assign", ticket.getId())
                .header("Authorization", "Bearer " + tokens.createToken(manager()))
                .contentType("application/json")
                .content("{\"technicianId\":" + technician().getId() + "}"))
                .andExpect(status().isNotFound());
    }

    @Test
    void closedTicketsCannotBeAssigned() throws Exception {
        Ticket ticket = createTicket();
        // Testa det riktiga CLOSED-värdet i PostgreSQL-enumen.
        jdbc.update("update tickets set status = 'CLOSED' where id = ?", ticket.getId());
        entityManager.clear();
        mvc.perform(patch("/api/tickets/{id}/assign", ticket.getId())
                .header("Authorization", "Bearer " + tokens.createToken(manager()))
                .contentType("application/json")
                .content("{\"technicianId\":" + technician().getId() + "}"))
                .andExpect(status().isConflict());
    }
}
