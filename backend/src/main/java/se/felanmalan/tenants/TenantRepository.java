package se.felanmalan.tenants;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import se.felanmalan.UserRole;

@Repository
public interface TenantRepository extends JpaRepository<Tenant, Long> {

    // Find a tenant by email
    Optional<Tenant> findByEmailAndRole(String email, UserRole.TENANT role);

    // Find all tenants
    List<Tenant> findByRole(UserRole role);

    // Find a tenant by ID
    Optional<Tenant> findByIdAndRole(Long id, UserRole role);

    // Check if email exists for a specific role
    boolean existsByEmailAndRole(String email,UserRole role);

    // Custom insert for PostgreSQL
    @Modifying
    @Transactional
    @Query(value = """
        INSERT INTO users (name, email, password_hash, role, created_at, updated_at)
        VALUES (:name, :email, :passwordHash, :role, :createdAt, :updatedAt)
        """, nativeQuery = true)
    void insertTenant(
            @Param("name") String name,
            @Param("email") String email,
            @Param("passwordHash") String passwordHash,
            @Param("role") String role,
            @Param("createdAt") LocalDateTime createdAt,
            @Param("updatedAt") LocalDateTime updatedAt
    );
}
