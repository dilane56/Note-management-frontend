package org.kfokam48.stagemanagementbackend.repository;

import jakarta.persistence.Id;
import org.kfokam48.stagemanagementbackend.model.Enseignant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnseignantRepository extends JpaRepository<Enseignant, Long> {
    List<Enseignant> findByFiliere(String filiere);
}
