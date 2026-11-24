package se.felanmalan.ticket;

public record TicketAssignmentResponse(
        Long id,
        Long assignedTo,
        String assignedTechnicianName,
        TicketStatus status
) {
}
