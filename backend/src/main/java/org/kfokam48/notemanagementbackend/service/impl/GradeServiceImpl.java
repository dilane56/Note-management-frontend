package org.kfokam48.notemanagementbackend.service.impl;

import jakarta.transaction.Transactional;
import org.kfokam48.notemanagementbackend.dto.grade.GradeRequestDTO;
import org.kfokam48.notemanagementbackend.dto.grade.GradeResponseDTO;
import org.kfokam48.notemanagementbackend.exception.RessourceNotFoundException;
import org.kfokam48.notemanagementbackend.mapper.GradeMapper;
import org.kfokam48.notemanagementbackend.model.Grade;
import org.kfokam48.notemanagementbackend.repository.EvaluationRepository;
import org.kfokam48.notemanagementbackend.repository.GradeRepository;
import org.kfokam48.notemanagementbackend.repository.StudentRepository;
import org.kfokam48.notemanagementbackend.service.GradeService;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@Transactional
public class GradeServiceImpl implements GradeService {
    private final GradeRepository gradeRepository;
    private final GradeMapper gradeMapper;
    private final StudentRepository studentRepository;
    private final EvaluationRepository evaluationRepository;

    public GradeServiceImpl(GradeRepository gradeRepository, GradeMapper gradeMapper, StudentRepository studentRepository, EvaluationRepository evaluationRepository) {
        this.gradeRepository = gradeRepository;
        this.gradeMapper = gradeMapper;
        this.studentRepository = studentRepository;
        this.evaluationRepository = evaluationRepository;
    }

    @Override
    public GradeResponseDTO getGrade(Long id) {
        Grade grade = gradeRepository.findById(id).orElseThrow(() -> new RessourceNotFoundException("Grade not found"));
        return gradeMapper.gradeToGradeResponseDTO(grade);
    }

    @Override
    public GradeResponseDTO addGrade(GradeRequestDTO grade) {
       return gradeMapper.gradeToGradeResponseDTO(gradeRepository.save(gradeMapper.gradeRequestDTOToGrade(grade)));
    }

    @Override
    public GradeResponseDTO updateGrade(Long id, GradeRequestDTO grade) {
        Grade grade1 = gradeRepository.findById(id).orElseThrow(() -> new RessourceNotFoundException("Grade not found"));
        grade1.setValue(grade.getNoteValue());
        grade1.setStudent(studentRepository.findById(grade.getStudentID()).orElseThrow(()->new RessourceNotFoundException("Student not found")));
        gradeRepository.save(grade1);
        return gradeMapper.gradeToGradeResponseDTO(grade1);

    }

    @Override
    public String deleteGrade(Long id) {
        Grade grade = gradeRepository.findById(id).orElseThrow(() -> new RessourceNotFoundException("Grade not found"));
        gradeRepository.delete(grade);
        return "Grade deleted Successfully";
    }

    @Override
    public List<GradeResponseDTO> getAllGrades() {
        return gradeMapper.gradesToGradeResponseDTO(gradeRepository.findAll());
    }

    @Override
    public List<GradeResponseDTO> getGradesByStudentId(Long studentId) {
        List<Grade> grades = gradeRepository.findByStudentId(studentId);
        return gradeMapper.gradesToGradeResponseDTO(grades);


    }

    @Override
    public GradeResponseDTO updateGradeComment(Long id, String comment) {
        Grade grade = gradeRepository.findById(id).orElseThrow(() -> new RessourceNotFoundException("Grade not found"));
        grade.setComment(comment);
        return gradeMapper.gradeToGradeResponseDTO(grade);
    }

    @Override
    public List<GradeResponseDTO> getGradesByStudentAndTypeEvaluationName(Long studentId, String typeEvaluationName) {
        return gradeMapper.gradesToGradeResponseDTO(gradeRepository.findByStudentIdAndEvaluation_TypeEvaluationName(studentId, typeEvaluationName));
    }


    @Override
    public List<GradeResponseDTO> getGradesByStudentAndSubject(Long studentId, Long subjectId) {
        List<Grade> grades = gradeRepository.findByStudentIdAndSubjectId(studentId, subjectId);
        return gradeMapper.gradesToGradeResponseDTO(grades);
    }
}
