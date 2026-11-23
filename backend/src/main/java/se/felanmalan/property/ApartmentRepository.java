package se.felanmalan.property;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApartmentRepository extends JpaRepository<Apartment, Long> {
    List<Apartment> findByPropertyIdOrderByIdDesc(Long propertyId);

    boolean existsByPropertyIdAndNumber(Long propertyId, String number);

    // tenant_id är UNIQUE: en hyresgäst har högst en lägenhet
    Optional<Apartment> findByTenantId(Long tenantId);
}
