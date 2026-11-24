package se.felanmalan.ticket;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.OffsetDateTime;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import se.felanmalan.auth.TokenService;
import se.felanmalan.property.Apartment;
import se.felanmalan.property.ApartmentRepository;
import se.felanmalan.property.Property;
import se.felanmalan.property.PropertyRepository;
import se.felanmalan.user.User;
import se.felanmalan.user.UserRepository;

// Mot riktig databas. Testet skapar egna användare, fastighet och lägenhet,
// så det beror inte på vad som redan finns (t.ex. testdata.sql).
// @Transactional rullar tillbaka allt efter varje test.
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class TechnicianTicketControllerTests {

    @Autowired MockMvc mvc;
    @Autowired TokenService tokens;
    @Autowired UserRepository users;
    @Autowired PropertyRepository properties;
    @Autowired ApartmentRepository apartments;
    @Autowired TicketRepository tickets;
    @Autowired JdbcTemplate jdbc;

    @Test
    void technicianSeesOnlyOwnUnresolvedTicketsMostUrgentFirst() throws Exception {
        User technician = newUser("Testtekniker", "TECHNICIAN");
        User otherTechnician = newUser("Annan tekniker", "TECHNICIAN");
        User tenant = newUser("Testhyresgäst", "TENANT");
        User manager = newUser("Testförvaltare", "MANAGER");

        Property property = new Property("Testfastigheten", "Testgatan 1");
        property.setOwnerId(manager.getId());
        property = properties.saveAndFlush(property);
        Apartment apartment = apartments.saveAndFlush(new Apartment(property.getId(), "1001", 2));

        OffsetDateTime now = OffsetDateTime.now();
        Ticket oldNormal = ticket(apartment, tenant, technician, TicketStatus.ASSIGNED, TicketPriority.NORMAL,
                false, now.minusDays(3), "Kranen droppar");
        Ticket newNormal = ticket(apartment, tenant, technician, TicketStatus.WAITING, TicketPriority.NORMAL,
                false, now.minusDays(1), "Väntar på reservdel");
        Ticket urgent = ticket(apartment, tenant, technician, TicketStatus.IN_PROGRESS, TicketPriority.URGENT,
                true, now.minusHours(1), "Vattenläcka");
        ticket(apartment, tenant, technician, TicketStatus.RESOLVED, TicketPriority.HIGH,
                false, now.minusDays(2), "Åtgärdat ärende");
        ticket(apartment, tenant, technician, TicketStatus.CLOSED, TicketPriority.HIGH,
                false, now.minusDays(2), "Stängt ärende");
        ticket(apartment, tenant, otherTechnician, TicketStatus.ASSIGNED, TicketPriority.URGENT,
                false, now.minusDays(5), "Annan teknikers ärende");

        mvc.perform(get("/api/tickets/assigned")
                .header("Authorization", "Bearer " + tokens.createToken(technician)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(3))
                .andExpect(jsonPath("$[0].id").value(urgent.getId()))
                .andExpect(jsonPath("$[0].propertyName").value("Testfastigheten"))
                .andExpect(jsonPath("$[0].propertyAddress").value("Testgatan 1"))
                .andExpect(jsonPath("$[0].apartmentNumber").value("1001"))
                .andExpect(jsonPath("$[0].floor").value(2))
                .andExpect(jsonPath("$[0].category").value("PLUMBING"))
                .andExpect(jsonPath("$[0].status").value("IN_PROGRESS"))
                .andExpect(jsonPath("$[0].masterKeyAllowed").value(true))
                .andExpect(jsonPath("$[1].id").value(oldNormal.getId()))
                .andExpect(jsonPath("$[1].masterKeyAllowed").value(false))
                .andExpect(jsonPath("$[2].id").value(newNormal.getId()));
    }

    @Test
    void technicianWithoutTicketsGetsEmptyList() throws Exception {
        User technician = newUser("Ledig tekniker", "TECHNICIAN");
        mvc.perform(get("/api/tickets/assigned")
                .header("Authorization", "Bearer " + tokens.createToken(technician)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void tenantAndManagerCannotAccessTechnicianEndpoint() throws Exception {
        for (String email : new String[]{"hyresgast@felanmalan.se", "forvaltare@felanmalan.se"}) {
            User user = users.findByEmail(email).orElseThrow();
            mvc.perform(get("/api/tickets/assigned")
                    .header("Authorization", "Bearer " + tokens.createToken(user)))
                    .andExpect(status().isForbidden());
        }
    }

    @Test
    void anonymousRequestIsUnauthorized() throws Exception {
        mvc.perform(get("/api/tickets/assigned")).andExpect(status().isUnauthorized());
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

    private Ticket ticket(Apartment apartment, User tenant, User technician, TicketStatus status,
            TicketPriority priority, boolean masterKeyAllowed, OffsetDateTime createdAt, String description) {
        Ticket ticket = new Ticket(apartment.getId(), tenant.getId(), TicketCategory.PLUMBING, description);
        ReflectionTestUtils.setField(ticket, "assignedTo", technician.getId());
        ReflectionTestUtils.setField(ticket, "status", status);
        ReflectionTestUtils.setField(ticket, "priority", priority);
        ReflectionTestUtils.setField(ticket, "masterKeyAllowed", masterKeyAllowed);
        ReflectionTestUtils.setField(ticket, "createdAt", createdAt);
        return tickets.saveAndFlush(ticket);
    }
}
