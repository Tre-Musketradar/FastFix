package se.felanmalan.ticket;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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

// Integrationsprov mot projektets riktiga PostgreSQL-konfiguration.
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class ManagerOpenTicketControllerTests {

    @Autowired MockMvc mvc;
    @Autowired TokenService tokens;
    @Autowired UserRepository users;
    @Autowired PropertyRepository properties;
    @Autowired ApartmentRepository apartments;
    @Autowired TicketRepository tickets;
    @Autowired JdbcTemplate jdbc;

    @Test
    void managerSeesOpenTicketsWithPropertyApartmentAndTechnicianButNotClosedOrOthers() throws Exception {
        User tenant = users.findByEmail("hyresgast@felanmalan.se").orElseThrow();
        User technician = users.findByEmail("tekniker@felanmalan.se").orElseThrow();

        // Egen förvaltare med egen fastighet och lägenhet, så att testet inte
        // beror på vad som redan finns i databasen (t.ex. testdata.sql).
        User manager = newManager("Testförvaltare");
        Property property = newProperty(manager, "Testfastigheten");
        Apartment apartment = apartments.saveAndFlush(new Apartment(property.getId(), "1001", 1));

        Ticket assigned = new Ticket(apartment.getId(), tenant.getId(), TicketCategory.ELECTRICAL, "Elen fungerar inte");
        ReflectionTestUtils.setField(assigned, "status", TicketStatus.ASSIGNED);
        ReflectionTestUtils.setField(assigned, "assignedTo", technician.getId());
        assigned = tickets.saveAndFlush(assigned);

        Ticket fresh = tickets.saveAndFlush(new Ticket(apartment.getId(), tenant.getId(), TicketCategory.PLUMBING, "Kranen läcker"));

        Ticket closed = new Ticket(apartment.getId(), tenant.getId(), TicketCategory.LOCKS_DOORS, "Stängt ärende");
        ReflectionTestUtils.setField(closed, "status", TicketStatus.CLOSED);
        tickets.saveAndFlush(closed);

        // En annan förvaltares fastighet ska inte dyka upp i listan.
        Property otherProperty = newProperty(newManager("Annan förvaltare"), "Andra fastigheten");
        Apartment otherApartment = apartments.saveAndFlush(new Apartment(otherProperty.getId(), "9999", null));
        tickets.saveAndFlush(new Ticket(otherApartment.getId(), tenant.getId(), TicketCategory.OTHER, "Hemligt ärende"));

        mvc.perform(get("/api/tickets/open")
                .header("Authorization", "Bearer " + tokens.createToken(manager)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value(fresh.getId()))
                .andExpect(jsonPath("$[0].status").value("NEW"))
                .andExpect(jsonPath("$[0].propertyName").value(property.getName()))
                .andExpect(jsonPath("$[0].apartmentNumber").value(apartment.getNumber()))
                .andExpect(jsonPath("$[0].assignedTechnicianName").isEmpty())
                .andExpect(jsonPath("$[1].id").value(assigned.getId()))
                .andExpect(jsonPath("$[1].assignedTechnicianName").value(technician.getName()));
    }

    @Test
    void tenantAndTechnicianCannotAccessManagerEndpoint() throws Exception {
        for (String email : new String[]{"hyresgast@felanmalan.se", "tekniker@felanmalan.se"}) {
            User user = users.findByEmail(email).orElseThrow();
            mvc.perform(get("/api/tickets/open")
                    .header("Authorization", "Bearer " + tokens.createToken(user)))
                    .andExpect(status().isForbidden());
        }
    }

    @Test
    void anonymousRequestIsUnauthorized() throws Exception {
        mvc.perform(get("/api/tickets/open")).andExpect(status().isUnauthorized());
    }

    // Ny förvaltare med samma lösenordshash som seed-förvaltaren (rullas tillbaka efter testet).
    private User newManager(String name) {
        Long id = jdbc.queryForObject("""
            insert into users (name, email, password_hash, role)
            select ?, ?, password_hash, 'MANAGER'::user_role
            from users where email = 'forvaltare@felanmalan.se' returning id
            """, Long.class, name, UUID.randomUUID() + "@example.test");
        return users.findById(id).orElseThrow();
    }

    private Property newProperty(User owner, String name) {
        Property property = new Property(name, "Testgatan 1");
        property.setOwnerId(owner.getId());
        return properties.saveAndFlush(property);
    }
}
