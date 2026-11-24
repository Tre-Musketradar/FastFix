package se.felanmalan.ticket;

import static org.assertj.core.api.Assertions.assertThat;

import jakarta.persistence.EntityManager;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import se.felanmalan.property.ApartmentRepository;
import se.felanmalan.user.UserRepository;

// Kolumnen room (V3__ticket_room.sql): sparas och läses tillbaka, och äldre ärenden utan rum fungerar.
@SpringBootTest
@Transactional
class TicketRoomTests {

    @Autowired
    private TicketRepository tickets;

    @Autowired
    private ApartmentRepository apartments;

    @Autowired
    private UserRepository users;

    @Autowired
    private EntityManager entityManager;

    @Test
    void savesTheRoomAndTheMasterKeyChoice() {
        Ticket saved = tickets.saveAndFlush(new Ticket(apartmentId(), tenantId(),
                TicketCategory.PLUMBING, "Kök", "Kranen droppar", true));
        entityManager.clear();

        Ticket loaded = tickets.findById(saved.getId()).orElseThrow();
        assertThat(loaded.getRoom()).isEqualTo("Kök");
        assertThat(loaded.isMasterKeyAllowed()).isTrue();
        assertThat(loaded.getStatus()).isEqualTo(TicketStatus.NEW);
    }

    @Test
    void ticketsWithoutRoomStillWork() {
        Ticket saved = tickets.saveAndFlush(new Ticket(apartmentId(), tenantId(),
                TicketCategory.OTHER, "Brevinkastet har lossnat"));
        entityManager.clear();

        assertThat(tickets.findById(saved.getId()).orElseThrow().getRoom()).isNull();
    }

    private Long apartmentId() {
        return apartments.findAll().getFirst().getId();
    }

    private Long tenantId() {
        return users.findByEmail("hyresgast@felanmalan.se").orElseThrow().getId();
    }

}
