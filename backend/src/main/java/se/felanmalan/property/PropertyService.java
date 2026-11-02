package se.felanmalan.property;

import org.springframework.stereotype.Service;

@Service
public class PropertyService {

    private final PropertyRepository propertyRepository;

    public PropertyService(PropertyRepository propertyRepository) {
        this.propertyRepository = propertyRepository;
    }

    public Property createProperty(CreatePropertyRequest request) {

        Property property = new Property(
                request.name(),
                request.address()
        );

        return propertyRepository.save(property);
    }
}