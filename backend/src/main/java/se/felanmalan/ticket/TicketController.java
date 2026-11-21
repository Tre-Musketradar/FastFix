package se.felanmalan.ticket;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @GetMapping("/open")
    @PreAuthorize("hasRole('MANAGER')")
    public List<ManagerOpenTicketResponse> getOpenTickets(@AuthenticationPrincipal Jwt jwt) {
        return ticketService.listOpenForManager(Long.valueOf(jwt.getSubject()));
    }

    @GetMapping("/mine")
    @PreAuthorize("hasRole('TENANT')")
    public List<Ticket> getMyTickets(@AuthenticationPrincipal Jwt jwt) {
        return ticketService.listMyTickets(Long.valueOf(jwt.getSubject()));
    }
}
