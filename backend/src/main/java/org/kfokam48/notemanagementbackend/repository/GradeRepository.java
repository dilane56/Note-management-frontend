package org.kfokam48.notemanagementbackend.repository;

import org.kfokam48.notemanagementbackend.enums.TypeEvaluation;
import org.kfokam48.notemanagementbackend.model.Evaluation;
import org.kfokam48.notemanagementbackend.model.Grade;
import org.kfokam48.notemanagementbackend.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GradeRepository extends JpaRepository<Grade, Long> {
    List<Grade> findByStudentId(Long studentId);

    List<Grade> findByStudentIdAndEvaluationId(Long studentId, Long evaluationId);
    List<Grade> findByStudentIdAndSubjectId(Long studentId, Long subjectId);

    List<Grade> findByStudentIdAndEvaluation_Type(Long studentId, TypeEvaluation evaluationType);


    List<Grade> findByStudent_StudentClass_IdAndEvaluation_Id(Long studentStudentClassId, Long evaluationId);



}
