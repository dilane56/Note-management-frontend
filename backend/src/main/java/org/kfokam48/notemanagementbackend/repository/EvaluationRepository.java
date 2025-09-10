package org.kfokam48.notemanagementbackend.repository;

import org.kfokam48.notemanagementbackend.model.Evaluation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {
}
