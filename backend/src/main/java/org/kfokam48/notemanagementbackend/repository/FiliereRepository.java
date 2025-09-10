package org.kfokam48.notemanagementbackend.repository;

import org.kfokam48.notemanagementbackend.model.Filiere;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FiliereRepository extends JpaRepository<Filiere, Long> {
}
