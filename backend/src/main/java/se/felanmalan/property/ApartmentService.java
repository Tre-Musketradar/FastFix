package se.felanmalan.property;

import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ApartmentService {

    private final ApartmentRepository apartmentRepository;
    private final PropertyRepository propertyRepository;

    public ApartmentService(ApartmentRepository apartmentRepository, PropertyRepository propertyRepository) {
        this.apartmentRepository = apartmentRepository;
        this.propertyRepository = propertyRepository;
    }

    public List<Apartment> listApartments(Long propertyId, Long managerId) {
        requireOwnedProperty(propertyId, managerId);
        return apartmentRepository.findByPropertyIdOrderByIdDesc(propertyId);
    }

    public Apartment createApartment(Long propertyId, CreateApartmentRequest request, Long managerId) {
        requireOwnedProperty(propertyId, managerId);

        String number = request.number().trim();
        if (apartmentRepository.existsByPropertyIdAndNumber(propertyId, number)) {
            throw duplicateNumber();
        }

        Apartment apartment = new Apartment(propertyId, number, request.floor());
        try {
            // Flushing catches the database UNIQUE(property_id, number) constraint here,
            // even if two requests attempt the same apartment number simultaneously.
            return apartmentRepository.saveAndFlush(apartment);
        } catch (DataIntegrityViolationException exception) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Lägenhetsnumret finns redan i fastigheten.",
                    exception
            );
        }
    }

    private void requireOwnedProperty(Long propertyId, Long managerId) {
        if (!propertyRepository.existsByIdAndOwnerId(propertyId, managerId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Fastigheten hittades inte.");
        }
    }

    private ResponseStatusException duplicateNumber() {
        return new ResponseStatusException(HttpStatus.CONFLICT, "Lägenhetsnumret finns redan i fastigheten.");
    }
}
