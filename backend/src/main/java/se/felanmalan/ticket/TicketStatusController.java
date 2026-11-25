package se.felanmalan.ticket;

import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tickets")
public class TicketStatusController {

    private final TicketStatusService service;

    public TicketStatusController(TicketStatusService service) {
        this.service = service;
    }

    @PatchMapping("/{ticketId}/status")
    @PreAuthorize("hasRole('TECHNICIAN')")
    public TicketStatusResponse changeStatus(
            @PathVariable Long ticketId,
            @Valid @RequestBody ChangeStatusRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        return service.changeStatusAsTechnician(Long.valueOf(jwt.getSubject()), ticketId, request.status());
    }

    @PatchMapping("/{ticketId}/close")
    @PreAuthorize("hasRole('MANAGER')")
    public TicketStatusResponse close(@PathVariable Long ticketId, @AuthenticationPrincipal Jwt jwt) {
        return service.closeAsManager(Long.valueOf(jwt.getSubject()), ticketId);
    }

}
