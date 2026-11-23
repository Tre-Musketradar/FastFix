package se.felanmalan.ticket;

/**
 * Kategori på ett ärende. Samma värden som PostgreSQL-enumen {@code ticket_category} (V1__init.sql).
 */
public enum TicketCategory {
    PLUMBING,
    ELECTRICAL,
    APPLIANCES,
    VENTILATION,
    LOCKS_DOORS,
    OTHER
}
