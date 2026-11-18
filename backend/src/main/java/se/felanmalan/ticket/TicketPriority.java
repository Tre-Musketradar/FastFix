package se.felanmalan.ticket;

/**
 * Prioritet på ett ärende. Samma värden som PostgreSQL-enumen {@code ticket_priority} (V1__init.sql).
 */
public enum TicketPriority {
    URGENT,
    HIGH,
    NORMAL,
    LOW
}
