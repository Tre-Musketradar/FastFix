package se.felanmalan.tenant;

import java.util.List;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import se.felanmalan.auth.MessageResponse;
import se.felanmalan.property.ApartmentSummary;

@RestController
@RequestMapping("/api/tenants")
public class TenantController {

    private final TenantService tenantService;

    public TenantController(TenantService tenantService) {
        this.tenantService = tenantService;
    }

    @PostMapping
    @PreAuthorize("hasRole('MANAGER')")
    @ResponseStatus(HttpStatus.CREATED)
    public TenantResponse createTenant(@Valid @RequestBody CreateTenantRequest request,
                                       @AuthenticationPrincipal Jwt jwt) {
        return tenantService.createTenant(request, Long.valueOf(jwt.getSubject()));
    }

    @GetMapping("/available-apartments")
    @PreAuthorize("hasRole('MANAGER')")
    public List<ApartmentSummary> availableApartments(@AuthenticationPrincipal Jwt jwt) {
        return tenantService.availableApartments(Long.valueOf(jwt.getSubject()));
    }

    @GetMapping("/me/apartment")
    @PreAuthorize("hasRole('TENANT')")
    public ApartmentSummary myApartment(@AuthenticationPrincipal Jwt jwt) {
        return tenantService.apartmentOf(Long.valueOf(jwt.getSubject()));
    }

    // Skicka med felmeddelandet, så att frontend kan skilja på upptagen e-post
    // och upptagen lägenhet (båda är 409).
    @ExceptionHandler(ResponseStatusException.class)
    ResponseEntity<MessageResponse> handle(ResponseStatusException exception) {
        return ResponseEntity.status(exception.getStatusCode())
                .body(new MessageResponse(exception.getReason()));
    }
}
