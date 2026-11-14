package se.felanmalan.tenants;

import se.felanmalan.tenants.CreateTenantDTO;
import se.felanmalan.tenants.TenantResponseDTO;
import se.felanmalan.tenants.TenantService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/tenants")
@CrossOrigin(origins = "*")
public class TenantController {

    private final TenantService tenantService;

    public TenantController(TenantService tenantService) {
        this.tenantService = tenantService;
    }


     // Create a new tenant
    @PostMapping("/insert")
    public ResponseEntity<TenantResponseDTO> createTenant(@Valid @RequestBody CreateTenantDTO createTenantDto) {
        try {
            TenantResponseDTO createdTenant = tenantService.createTenant(createTenantDto);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(createdTenant);
        }
        catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .build();
        }
        catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .build();
        }
    }

    @GetMapping("/getAll")
    public ResponseEntity<TenantResponseDTO> getAll() {
        return tenantService
                .getAll().stream()
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }


     // Get tenant by ID
    @GetMapping("/getById/{id}")
    public ResponseEntity<TenantResponseDTO> getTenantById(@PathVariable Long id) {
        return tenantService
                .getTenantById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

     // Get tenant by email
    @GetMapping("/email/{email}")
    public ResponseEntity<TenantResponseDto> getTenantByEmail(@PathVariable String email) {
        return tenantService
                .getTenantByEmail(email)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}

