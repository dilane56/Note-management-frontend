package org.kfokam48.notemanagementbackend.mapper;

import org.kfokam48.notemanagementbackend.dto.classes.StudentInClassDTo;
import org.kfokam48.notemanagementbackend.dto.grade.EvaluationInGradeDTO;
import org.kfokam48.notemanagementbackend.dto.grade.GradeRequestDTO;
import org.kfokam48.notemanagementbackend.dto.grade.GradeResponseDTO;
import org.kfokam48.notemanagementbackend.exception.RessourceNotFoundException;
import org.kfokam48.notemanagementbackend.model.Evaluation;
import org.kfokam48.notemanagementbackend.model.Grade;
import org.kfokam48.notemanagementbackend.model.Student;
import org.kfokam48.notemanagementbackend.repository.EvaluationRepository;
import org.kfokam48.notemanagementbackend.repository.StudentRepository;
import org.kfokam48.notemanagementbackend.repository.SubjectRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class GradeMapper {
    private final ModelMapper modelMapper;
    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;
    private final EvaluationRepository evaluationRepository;

    public GradeMapper(ModelMapper modelMapper, StudentRepository studentRepository, SubjectRepository subjectRepository, EvaluationRepository evaluationRepository) {
        this.modelMapper = modelMapper;
        this.studentRepository = studentRepository;
        this.subjectRepository = subjectRepository;
        this.evaluationRepository = evaluationRepository;
    }
    public Grade gradeRequestDTOToGrade(GradeRequestDTO gradeRequestDTO) {
        Grade grade = new Grade();
        grade.setComment("RAS");
        grade.setValue(gradeRequestDTO.getNoteValue());
      //  grade.setNoteMaximale(gradeRequestDTO.getNoteMaximale());
        grade.setStudent(studentRepository.findById(gradeRequestDTO.getStudentID()).orElseThrow(()->new RessourceNotFoundException("Student not found")));
        grade.setSubject(subjectRepository.findById(gradeRequestDTO.getSubjectID()).orElseThrow(()->new RessourceNotFoundException("Subject not found")));
        grade.setEvaluation(evaluationRepository.findById(gradeRequestDTO.getEvaluationId()).orElseThrow(()->new RessourceNotFoundException("Evaluation not found")));
        return grade;
    }

    public GradeResponseDTO gradeToGradeResponseDTO(Grade grade) {
        GradeResponseDTO gradeResponseDTO = new GradeResponseDTO();
        gradeResponseDTO.setGradeId(grade.getId());
        gradeResponseDTO.setComment(grade.getComment());
        gradeResponseDTO.setNoteValue(grade.getValue());
        gradeResponseDTO.setSubjectName(grade.getSubject().getName());
        gradeResponseDTO.setStudent(studentToStudentInClassDTo(grade.getStudent()));
        gradeResponseDTO.setEvaluation(evaluationToEvaluationInGradeDTO(grade.getEvaluation()));
        return gradeResponseDTO;
    }

    public StudentInClassDTo studentToStudentInClassDTo(Student student) {
        StudentInClassDTo studentInClassDTo = new StudentInClassDTo();
        studentInClassDTo.setStudentFirstName(student.getFirstName());
        studentInClassDTo.setStudentLastName(student.getLastName());
        studentInClassDTo.setStudentMatricule(student.getMatricule());
        return studentInClassDTo;

    }

    public EvaluationInGradeDTO evaluationToEvaluationInGradeDTO(Evaluation evaluation) {
        if(evaluation == null) {
            return null;
        }else{
            EvaluationInGradeDTO evaluationInGradeDTO = new EvaluationInGradeDTO();
            evaluationInGradeDTO.setSessionEvaluation(evaluation.getSessionEvaluation());
           // evaluationInGradeDTO.setNumeroEvaluation(evaluation.getNumeroEvaluation());
            evaluationInGradeDTO.setTypeEvaluationName(evaluation.getTypeEvaluationName());
            return evaluationInGradeDTO;
        }

    }

    public List<GradeResponseDTO> gradesToGradeResponseDTO(List<Grade> grades) {
        List<GradeResponseDTO> gradeResponseDTOs = new ArrayList<>();
        for(Grade grade : grades) {
            gradeResponseDTOs.add(gradeToGradeResponseDTO(grade));
        }
        return gradeResponseDTOs;
    }
}
