package org.kfokam48.notemanagementbackend.repository;

import org.kfokam48.notemanagementbackend.enums.TypeEvaluation;
import org.kfokam48.notemanagementbackend.model.Evaluation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {
    Optional<Evaluation> findByTypeAndAnneeAcademique(TypeEvaluation type, String anneeAcademique);
}
