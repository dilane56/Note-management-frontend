package org.kfokam48.notemanagementbackend.repository;

import org.kfokam48.notemanagementbackend.model.Grade;
import org.kfokam48.notemanagementbackend.model.Transcript;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TranscriptRepository extends JpaRepository<Transcript, Long> {
     Optional<Transcript> findByStudentId(Long studentId);
     Optional<Transcript> findByStudentIdAndEvaluationId(Long studentId, Long evaluationId);
}
