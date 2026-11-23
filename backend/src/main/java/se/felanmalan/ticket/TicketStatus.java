package se.felanmalan.ticket;

/**
 * Status på ett ärende. Samma värden som PostgreSQL-enumen {@code ticket_status} (V1__init.sql).
 */
public enum TicketStatus {
    NEW,
    ASSIGNED,
    IN_PROGRESS,
    WAITING,
    RESOLVED,
    CLOSED
}
