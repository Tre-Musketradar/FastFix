package se.felanmalan.user;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

	Optional<User> findByEmail(String email);

    // Används av förvaltarens teknikerlista vid tilldelning av ärenden.
    List<User> findByRoleOrderByNameAsc(Role role);

}
