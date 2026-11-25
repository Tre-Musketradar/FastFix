package se.felanmalan.tenant;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import se.felanmalan.apartment.Apartment;
import se.felanmalan.apartment.ApartmentRepository;
import se.felanmalan.property.PropertyRepository;
import se.felanmalan.user.Role;
import se.felanmalan.user.User;
import se.felanmalan.user.UserRepository;

class TenantServiceTests {

    private UserRepository users;
    private ApartmentRepository apartments;
    private PropertyRepository properties;
    private PasswordEncoder passwordEncoder;
    private TenantService service;

    @BeforeEach
    void setUp() {
        users = mock(UserRepository.class);
        apartments = mock(ApartmentRepository.class);
        properties = mock(PropertyRepository.class);
        passwordEncoder = mock(PasswordEncoder.class);
        service = new TenantService(users, apartments, properties, passwordEncoder);
    }

    @Test
    void createsTenantAndLinksApartment() {
        Apartment apartment = new Apartment(10L, "1001", 0);
        apartment.setId(5L);
        when(users.findByEmail("anna@example.com")).thenReturn(Optional.empty());
        when(apartments.findById(5L)).thenReturn(Optional.of(apartment));
        when(properties.existsByIdAndOwnerId(10L, 1L)).thenReturn(true);
        when(passwordEncoder.encode("hemligt123")).thenReturn("hash");
        when(users.saveAndFlush(any(User.class)))
                .thenReturn(new User(7L, "Anna Andersson", "anna@example.com", "hash", Role.TENANT));
        when(apartments.saveAndFlush(any(Apartment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        TenantResponse response = service.createTenant(
                new CreateTenantRequest(" Anna Andersson ", " Anna@Example.com ", "hemligt123", 5L), 1L);

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(users).saveAndFlush(captor.capture());
        assertThat(captor.getValue().getName()).isEqualTo("Anna Andersson");
        assertThat(captor.getValue().getEmail()).isEqualTo("anna@example.com");
        assertThat(captor.getValue().getPasswordHash()).isEqualTo("hash");
        assertThat(captor.getValue().getRole()).isEqualTo(Role.TENANT);
        assertThat(apartment.getTenantId()).isEqualTo(7L);
        assertThat(response.id()).isEqualTo(7L);
        assertThat(response.apartmentId()).isEqualTo(5L);
    }

    @Test
    void refusesEmailThatAlreadyExists() {
        when(users.findByEmail("anna@example.com"))
                .thenReturn(Optional.of(new User(3L, "Befintlig", "anna@example.com", "hash", Role.TENANT)));

        assertThatThrownBy(() -> service.createTenant(
                new CreateTenantRequest("Anna", "anna@example.com", "hemligt123", 5L), 1L))
                .isInstanceOfSatisfying(ResponseStatusException.class,
                        exception -> assertThat(exception.getStatusCode()).isEqualTo(HttpStatus.CONFLICT));
        verify(users, never()).saveAndFlush(any());
    }

    @Test
    void refusesEmailThatIsTakenDuringASimultaneousRequest() {
        when(users.findByEmail("anna@example.com")).thenReturn(Optional.empty());
        when(apartments.findById(5L)).thenReturn(Optional.of(new Apartment(10L, "1001", 0)));
        when(properties.existsByIdAndOwnerId(10L, 1L)).thenReturn(true);
        when(passwordEncoder.encode(any())).thenReturn("hash");
        when(users.saveAndFlush(any(User.class))).thenThrow(new DataIntegrityViolationException("duplicate"));

        assertThatThrownBy(() -> service.createTenant(
                new CreateTenantRequest("Anna", "anna@example.com", "hemligt123", 5L), 1L))
                .isInstanceOfSatisfying(ResponseStatusException.class,
                        exception -> assertThat(exception.getStatusCode()).isEqualTo(HttpStatus.CONFLICT));
        verify(apartments, never()).saveAndFlush(any());
    }

    @Test
    void refusesApartmentThatDoesNotExist() {
        when(users.findByEmail("anna@example.com")).thenReturn(Optional.empty());
        when(apartments.findById(5L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.createTenant(
                new CreateTenantRequest("Anna", "anna@example.com", "hemligt123", 5L), 1L))
                .isInstanceOfSatisfying(ResponseStatusException.class,
                        exception -> assertThat(exception.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND));
        verify(users, never()).saveAndFlush(any());
    }

    @Test
    void refusesApartmentInSomeoneElsesProperty() {
        Apartment apartment = new Apartment(10L, "1001", 0);
        apartment.setId(5L);
        when(users.findByEmail("anna@example.com")).thenReturn(Optional.empty());
        when(apartments.findById(5L)).thenReturn(Optional.of(apartment));
        when(properties.existsByIdAndOwnerId(10L, 2L)).thenReturn(false);

        assertThatThrownBy(() -> service.createTenant(
                new CreateTenantRequest("Anna", "anna@example.com", "hemligt123", 5L), 2L))
                .isInstanceOfSatisfying(ResponseStatusException.class,
                        exception -> assertThat(exception.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND));
        verify(users, never()).saveAndFlush(any());
    }

    @Test
    void refusesApartmentThatAlreadyHasATenant() {
        Apartment apartment = new Apartment(10L, "1001", 0);
        apartment.setId(5L);
        apartment.setTenantId(9L);
        when(users.findByEmail("anna@example.com")).thenReturn(Optional.empty());
        when(apartments.findById(5L)).thenReturn(Optional.of(apartment));
        when(properties.existsByIdAndOwnerId(10L, 1L)).thenReturn(true);

        assertThatThrownBy(() -> service.createTenant(
                new CreateTenantRequest("Anna", "anna@example.com", "hemligt123", 5L), 1L))
                .isInstanceOfSatisfying(ResponseStatusException.class,
                        exception -> assertThat(exception.getStatusCode()).isEqualTo(HttpStatus.CONFLICT));
        verify(users, never()).saveAndFlush(any());
    }
}
