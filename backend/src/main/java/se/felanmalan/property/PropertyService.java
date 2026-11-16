package se.felanmalan.property;

import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class PropertyService {

    private final PropertyRepository propertyRepository;

    public PropertyService(PropertyRepository propertyRepository) {
        this.propertyRepository = propertyRepository;
    }

    public Property createProperty(CreatePropertyRequest request, Long ownerId) {
        Property property = new Property(
                request.name().trim(),
                request.address().trim()
        );
        property.setOwnerId(ownerId);
        return propertyRepository.save(property);
    }

    public List<Property> listProperties(Long ownerId) {
        return propertyRepository.findByOwnerIdOrderByIdDesc(ownerId);
    }
}
