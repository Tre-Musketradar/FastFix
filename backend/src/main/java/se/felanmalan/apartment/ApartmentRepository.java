package se.felanmalan.apartment;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApartmentRepository extends JpaRepository<Apartment, Long> {
    List<Apartment> findByPropertyIdOrderByIdDesc(Long propertyId);

    boolean existsByPropertyIdAndNumber(Long propertyId, String number);
}
