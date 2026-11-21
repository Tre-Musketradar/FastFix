package se.felanmalan.ticket;

import java.util.List;

import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tickets")
public class TicketAssignmentController {

    private final TicketAssignmentService service;

    public TicketAssignmentController(TicketAssignmentService service) {
        this.service = service;
    }

    @GetMapping("/technicians")
    @PreAuthorize("hasRole('MANAGER')")
    public List<TechnicianOption> getTechnicians() {
        return service.listTechnicians();
    }

    @PatchMapping("/{ticketId}/assign")
    @PreAuthorize("hasRole('MANAGER')")
    public TicketAssignmentResponse assign(
            @PathVariable Long ticketId,
            @Valid @RequestBody AssignTechnicianRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        return service.assign(Long.valueOf(jwt.getSubject()), ticketId, request.technicianId());
    }

    @GetMapping("/assigned")
    @PreAuthorize("hasRole('TECHNICIAN')")
    public List<Ticket> myAssignments(@AuthenticationPrincipal Jwt jwt) {
        return service.listAssignedToTechnician(Long.valueOf(jwt.getSubject()));
    }
}
