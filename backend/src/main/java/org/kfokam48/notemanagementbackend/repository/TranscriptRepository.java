package org.kfokam48.notemanagementbackend.repository;

import org.kfokam48.notemanagementbackend.model.Transcript;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TranscriptRepository extends JpaRepository<Transcript, Long> {
     Optional<Transcript> findByStudentId(Long studentId);
     Optional<Transcript> findByStudentIdAndEvaluationId(Long studentId, Long evaluationId);
     List<Transcript> findByStudent_StudentClass_Id(Long classId);
     List<Transcript> findByStudent_StudentClass_IdAndEvaluationId(Long classId, Long evaluationId);
}
