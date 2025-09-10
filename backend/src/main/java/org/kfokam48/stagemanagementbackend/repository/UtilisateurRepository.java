package org.kfokam48.stagemanagementbackend.repository;

import org.kfokam48.stagemanagementbackend.enums.UserStatus;
import org.kfokam48.stagemanagementbackend.model.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {
    Optional<Utilisateur> findByEmail(String email);
    boolean existsByEmail(String email);
    List<Utilisateur> findByStatus(UserStatus status);
}
