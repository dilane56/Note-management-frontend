package org.kfokam48.notemanagementbackend.service;

import org.kfokam48.notemanagementbackend.dto.grade.GradeRequestDTO;
import org.kfokam48.notemanagementbackend.dto.grade.GradeResponseDTO;
import org.kfokam48.notemanagementbackend.dto.grade.TeacherGradeRequestDTO;
import org.kfokam48.notemanagementbackend.dto.student.StudentResponseDTO;
import org.kfokam48.notemanagementbackend.dto.subject.SubjectResponseDTO;
import org.kfokam48.notemanagementbackend.enums.TypeEvaluation;

import java.util.List;

public interface GradeService {
    public GradeResponseDTO getGrade(Long id);
    public GradeResponseDTO addGrade(GradeRequestDTO grade);
    public GradeResponseDTO updateGrade(Long id, GradeRequestDTO grade);
    public String deleteGrade(Long id);
    public List<GradeResponseDTO> getAllGrades();
    public List<GradeResponseDTO> getGradesByStudentId(Long studentId);
    public GradeResponseDTO updateGradeComment(Long id, String comment);
    public List<GradeResponseDTO> getGradesByStudentAndTypeEvaluationName(Long studentId, TypeEvaluation typeEvaluationName);
    List<GradeResponseDTO> getGradesByStudentAndSubject(Long studentId, Long subjectId);
    GradeResponseDTO addGradeWithComment(Long studentId, Long subjectId, TeacherGradeRequestDTO teacherGradeRequest);
    List<StudentResponseDTO> getStudentsBySubject(Long subjectId);
    List<SubjectResponseDTO> getSubjectsByTeacher(Long teacherId);
}
