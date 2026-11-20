package se.felanmalan.tenants;

import se.felanmalan.tenants.CreateTenantDTO;
import se.felanmalan.tenants.TenantResponseDTO;
import se.felanmalan.tenants.Tenant;
import se.felanmalan.UserRole;
import se.felanmalan.tenants.TenantRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TenantService {

    private final TenantRepository tenantRepository;
    private final PasswordEncoder passwordEncoder; // to be added later

    public TenantService(TenantRepository tenantRepository, PasswordEncoder passwordEncoder) {
        this.tenantRepository = tenantRepository;
        this.passwordEncoder = passwordEncoder;
    }


     // Create a new tenant from CreateTenantDto
    public void createTenant(CreateTenantDTO createTenantDto) {
        // Validate email doesn't already exist
        if (tenantRepository.existsByEmailAndRole(createTenantDto.email(), UserRole.TENANT)) {
            throw new IllegalArgumentException("E-postadressen är redan registrerad");
        }

        // Hash the password
        String hashedPassword = passwordEncoder.encode(createTenantDto.password());

        // Create user entity
        Tenant tenant = new Tenant(
                createTenantDto.name(),
                createTenantDto.email(),
                hashedPassword,
                UserRole.TENANT
        );

        // Save to database
        tenantRepository.insertTenant(
                tenant.getName(),
                tenant.getEmail(),
                tenant.getPasswordHash(),
                tenant.getRole(),
                tenant.getCreatedAt(),
                tenant.getUpdatedAt());

    }


     // Convert User entity to TenantResponseDto
    public TenantResponseDTO toTenantResponseDto(Tenant tenant) {
        return new TenantResponseDTO(
                tenant.getId(),
                tenant.getName(),
                tenant.getEmail(),
                tenant.getRole()
        );
    }


     // Convert CreateTenantDto to User entity
    public Tenant toUserEntity(CreateTenantDTO createTenantDto) {
        String hashedPassword = passwordEncoder.encode(createTenantDto.password());
        return new User(
                createTenantDto.name(),
                createTenantDto.email(),
                hashedPassword,
                UserRole.TENANT
        );
    }

     // Get everyone
    public List<TenantResponseDTO> getAll() {
        List<TenantResponseDTO> list = tenantRepository.findAll();

        list.stream().map(this::toTenantResponseDto);
        return list;
    }

     // Get tenant by email
    public Optional<TenantResponseDTO> getTenantByEmail(String email) {
        return tenantRepository
                .findByEmailAndRole(email, UserRole.TENANT)
                .map(this::toTenantResponseDto);
    }


     // Get tenant by ID
    public Optional<TenantResponseDTO> getTenantById(Long id) {
        return tenantRepository
                .findByIdAndRole(id, UserRole.TENANT)
                .map(this::toTenantResponseDto);
    }
}

