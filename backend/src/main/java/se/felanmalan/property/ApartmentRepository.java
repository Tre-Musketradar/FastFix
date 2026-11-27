package se.felanmalan.property;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ApartmentRepository extends JpaRepository<Apartment, Long> {
    List<Apartment> findByPropertyIdOrderByIdDesc(Long propertyId);

    boolean existsByPropertyIdAndNumber(Long propertyId, String number);

    // tenant_id är UNIQUE: en hyresgäst har högst en lägenhet
    Optional<Apartment> findByTenantId(Long tenantId);

    // Lediga lägenheter i förvaltarens fastigheter, för att välja lägenhet åt en ny hyresgäst (story 4).
    @Query("""
            select new se.felanmalan.property.ApartmentSummary(a.id, p.name, p.address, a.number, a.floor)
            from Apartment a
            join Property p on p.id = a.propertyId
            where p.ownerId = :managerId and a.tenantId is null
            order by p.name, a.number
            """)
    List<ApartmentSummary> findAvailableForManager(@Param("managerId") Long managerId);

    // Hyresgästens egen lägenhet (story 4: "ser sin lägenhet").
    @Query("""
            select new se.felanmalan.property.ApartmentSummary(a.id, p.name, p.address, a.number, a.floor)
            from Apartment a
            join Property p on p.id = a.propertyId
            where a.tenantId = :tenantId
            """)
    Optional<ApartmentSummary> findSummaryByTenantId(@Param("tenantId") Long tenantId);
}
