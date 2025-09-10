package org.kfokam48.notemanagementbackend.repository;

import org.kfokam48.notemanagementbackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email); // Recherche par email pour l’authentification
}

