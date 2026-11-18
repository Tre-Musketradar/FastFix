package se.felanmalan.property;

import java.util.List;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/properties/{propertyId}/apartments")
@PreAuthorize("hasRole('MANAGER')")
public class ApartmentController {

    private final ApartmentService apartmentService;

    public ApartmentController(ApartmentService apartmentService) {
        this.apartmentService = apartmentService;
    }

    @GetMapping
    public List<Apartment> listApartments(@PathVariable Long propertyId, @AuthenticationPrincipal Jwt jwt) {
        return apartmentService.listApartments(propertyId, Long.valueOf(jwt.getSubject()));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Apartment createApartment(
            @PathVariable Long propertyId,
            @Valid @RequestBody CreateApartmentRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        return apartmentService.createApartment(propertyId, request, Long.valueOf(jwt.getSubject()));
    }
}
