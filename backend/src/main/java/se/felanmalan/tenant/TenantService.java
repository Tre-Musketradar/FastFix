package se.felanmalan.tenant;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import se.felanmalan.apartment.Apartment;
import se.felanmalan.apartment.ApartmentRepository;
import se.felanmalan.property.PropertyRepository;
import se.felanmalan.user.Role;
import se.felanmalan.user.User;
import se.felanmalan.user.UserRepository;

@Service
public class TenantService {

    private final UserRepository userRepository;
    private final ApartmentRepository apartmentRepository;
    private final PropertyRepository propertyRepository;
    private final PasswordEncoder passwordEncoder;

    public TenantService(UserRepository userRepository,
                         ApartmentRepository apartmentRepository,
                         PropertyRepository propertyRepository,
                         PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.apartmentRepository = apartmentRepository;
        this.propertyRepository = propertyRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public TenantResponse createTenant(CreateTenantRequest request, Long managerId) {
        String email = request.email().trim().toLowerCase();

        if (userRepository.findByEmail(email).isPresent()) {
            throw emailTaken();
        }

        Apartment apartment = apartmentRepository.findById(request.apartmentId())
                .filter(a -> propertyRepository.existsByIdAndOwnerId(a.getPropertyId(), managerId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lägenheten hittades inte."));

        if (apartment.getTenantId() != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Lägenheten har redan en hyresgäst.");
        }

        User tenant = new User(
                request.name().trim(),
                email,
                passwordEncoder.encode(request.password()),
                Role.TENANT
        );

        // Flushing catches the UNIQUE constraints on users.email and apartments.tenant_id
        // even if two requests race each other.
        User savedTenant;
        try {
            savedTenant = userRepository.saveAndFlush(tenant);
        } catch (DataIntegrityViolationException exception) {
            throw emailTaken();
        }

        apartment.setTenantId(savedTenant.getId());
        try {
            apartmentRepository.saveAndFlush(apartment);
        } catch (DataIntegrityViolationException exception) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Lägenheten har redan en hyresgäst.", exception);
        }

        return TenantResponse.from(savedTenant, apartment.getId());
    }

    private ResponseStatusException emailTaken() {
        return new ResponseStatusException(HttpStatus.CONFLICT, "E-postadressen används redan");
    }
}
