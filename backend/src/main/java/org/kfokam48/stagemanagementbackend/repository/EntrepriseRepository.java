package org.kfokam48.stagemanagementbackend.repository;


import org.kfokam48.stagemanagementbackend.model.Entreprise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EntrepriseRepository extends JpaRepository<Entreprise, Long> {
    // Custom query methods can be defined here if needed
    // For example, findByNom(String nom);
}
