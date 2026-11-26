package se.felanmalan.ticket;

import java.time.OffsetDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "tickets")
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "apartment_id", nullable = false)
    private Long apartmentId;

    @Column(name = "created_by", nullable = false)
    private Long createdBy;

    @Column(name = "assigned_to")
    private Long assignedTo;

    // PostgreSQL-enum: utan @JdbcTypeCode försöker Hibernate spara varchar (som i User)
    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(nullable = false, columnDefinition = "ticket_category")
    private TicketCategory category;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(nullable = false, columnDefinition = "ticket_priority")
    private TicketPriority priority = TicketPriority.NORMAL;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(nullable = false, columnDefinition = "ticket_status")
    private TicketStatus status = TicketStatus.NEW;

    // Fritt textfält (V3). NULL för äldre ärenden.
    @Column(length = 50)
    private String room;

    @Column(nullable = false, columnDefinition = "text")
    private String description;

    @Column(name = "master_key_allowed", nullable = false)
    private boolean masterKeyAllowed;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column(name = "closed_at")
    private OffsetDateTime closedAt;

    protected Ticket() {
    }

    public Ticket(Long apartmentId, Long createdBy, TicketCategory category, String description) {
        this.apartmentId = apartmentId;
        this.createdBy = createdBy;
        this.category = category;
        this.description = description;
    }

    /** Ny felanmälan från hyresgästen (story 5): med rum och val av huvudnyckel. */
    public Ticket(Long apartmentId, Long createdBy, TicketCategory category, String room,
            String description, boolean masterKeyAllowed) {
        this(apartmentId, createdBy, category, description);
        this.room = room;
        this.masterKeyAllowed = masterKeyAllowed;
    }

    /** Tilldelning sätter alltid status Tilldelad, även vid byte av tekniker. */
    public void assignTechnician(Long technicianId) {
        this.assignedTo = technicianId;
        this.status = TicketStatus.ASSIGNED;
    }

    /** Statusändring (story 11). Vilka ändringar som är tillåtna avgör TicketStatusService. */
    public void changeStatus(TicketStatus status) {
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public Long getApartmentId() {
        return apartmentId;
    }

    public Long getCreatedBy() {
        return createdBy;
    }

    public Long getAssignedTo() {
        return assignedTo;
    }

    public TicketCategory getCategory() {
        return category;
    }

    public TicketPriority getPriority() {
        return priority;
    }

    public TicketStatus getStatus() {
        return status;
    }

    public String getRoom() {
        return room;
    }

    public String getDescription() {
        return description;
    }

    public boolean isMasterKeyAllowed() {
        return masterKeyAllowed;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public OffsetDateTime getClosedAt() {
        return closedAt;
    }
}
