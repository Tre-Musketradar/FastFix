package se.felanmalan.ticket;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import se.felanmalan.user.Role;

@RestController
@RequestMapping("/api/tickets")
public class TicketHistoryController {

    private final TicketHistoryService historyService;

    public TicketHistoryController(TicketHistoryService historyService) {
        this.historyService = historyService;
    }

    @GetMapping("/{ticketId}/history")
    @PreAuthorize("hasAnyRole('TENANT', 'TECHNICIAN', 'MANAGER')")
    public List<TicketHistoryEntry> getHistory(
            @PathVariable Long ticketId,
            @AuthenticationPrincipal Jwt jwt) {
        return historyService.historyFor(
                ticketId,
                Long.valueOf(jwt.getSubject()),
                Role.valueOf(jwt.getClaimAsString("role")));
    }
}
