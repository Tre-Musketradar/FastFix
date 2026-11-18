package se.felanmalan.property;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

class ApartmentServiceTests {

    private ApartmentRepository apartments;
    private PropertyRepository properties;
    private ApartmentService service;

    @BeforeEach
    void setUp() {
        apartments = mock(ApartmentRepository.class);
        properties = mock(PropertyRepository.class);
        service = new ApartmentService(apartments, properties);
    }

    @Test
    void createsApartmentForAnOwnedProperty() {
        when(properties.existsByIdAndOwnerId(10L, 1L)).thenReturn(true);
        when(apartments.saveAndFlush(any(Apartment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Apartment created = service.createApartment(10L, new CreateApartmentRequest(" 1001 ", 0), 1L);

        assertThat(created.getNumber()).isEqualTo("1001");
        assertThat(created.getFloor()).isZero();
        assertThat(created.getPropertyId()).isEqualTo(10L);
        assertThat(created.getTenantId()).isNull();
        verify(apartments).existsByPropertyIdAndNumber(10L, "1001");
    }

    @Test
    void refusesDuplicateNumberInTheSameProperty() {
        when(properties.existsByIdAndOwnerId(10L, 1L)).thenReturn(true);
        when(apartments.existsByPropertyIdAndNumber(10L, "1001")).thenReturn(true);

        assertThatThrownBy(() -> service.createApartment(10L, new CreateApartmentRequest("1001", 2), 1L))
                .isInstanceOfSatisfying(ResponseStatusException.class,
                        exception -> assertThat(exception.getStatusCode()).isEqualTo(HttpStatus.CONFLICT));
        verify(apartments, never()).saveAndFlush(any());
    }

    @Test
    void cannotCreateApartmentInSomeoneElsesProperty() {
        assertThatThrownBy(() -> service.createApartment(10L, new CreateApartmentRequest("1001", 2), 2L))
                .isInstanceOfSatisfying(ResponseStatusException.class,
                        exception -> assertThat(exception.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND));
        verify(apartments, never()).saveAndFlush(any());
    }

    @Test
    void cannotListApartmentsInSomeoneElsesProperty() {
        assertThatThrownBy(() -> service.listApartments(10L, 2L))
                .isInstanceOfSatisfying(ResponseStatusException.class,
                        exception -> assertThat(exception.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND));
        verify(apartments, never()).findByPropertyIdOrderByIdDesc(10L);
    }
}
