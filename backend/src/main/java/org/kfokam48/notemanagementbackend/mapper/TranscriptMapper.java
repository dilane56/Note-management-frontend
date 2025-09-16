package org.kfokam48.notemanagementbackend.mapper;

import org.kfokam48.notemanagementbackend.dto.transcript.GradeInTranscriptDTO;
import org.kfokam48.notemanagementbackend.dto.transcript.TranscriptRequestDTO;
import org.kfokam48.notemanagementbackend.dto.transcript.TranscriptResponseDTO;
import org.kfokam48.notemanagementbackend.dto.student.StudentRankingDTO;
import org.kfokam48.notemanagementbackend.exception.RessourceNotFoundException;
import org.kfokam48.notemanagementbackend.model.Grade;
import org.kfokam48.notemanagementbackend.model.Student;
import org.kfokam48.notemanagementbackend.model.Transcript;
import org.kfokam48.notemanagementbackend.repository.EvaluationRepository;
import org.kfokam48.notemanagementbackend.repository.GradeRepository;
import org.kfokam48.notemanagementbackend.repository.StudentRepository;
import org.kfokam48.notemanagementbackend.service.impl.StudentServiceImpl;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;


import java.util.ArrayList;
import java.util.List;

@Component
public class TranscriptMapper {
    private final ModelMapper modelMapper;
    private final StudentRepository studentRepository;
    private final ClassMapper classMapper;
    private final GradeMapper gradeMapper;
    private final EvaluationRepository evaluationRepository;
    private final GradeRepository gradeRepository;
    private final StudentServiceImpl studentService;

    public TranscriptMapper(ModelMapper modelMapper, StudentRepository studentRepository, ClassMapper classMapper, GradeMapper gradeMapper, EvaluationRepository evaluationRepository, GradeRepository gradeRepository, StudentServiceImpl studentService) {
        this.modelMapper = modelMapper;
        this.studentRepository = studentRepository;
        this.classMapper = classMapper;
        this.gradeMapper = gradeMapper;
        this.evaluationRepository = evaluationRepository;
        this.gradeRepository = gradeRepository;
        this.studentService = studentService;
    }

    public Transcript transcriptRequestDTOToTranscript(TranscriptRequestDTO requestDTO) {
        Transcript transcript = new Transcript();
        Student student =studentRepository.findById(requestDTO.getStudentId()).orElseThrow(()->new RessourceNotFoundException("Student not found"));
        transcript.setStudent(student);
        transcript.setEvaluation(evaluationRepository.findById(requestDTO.getEvaluationId()).orElseThrow(()->new RessourceNotFoundException("Evaluation not found")));
        transcript.setGrades(gradeRepository.findByStudentIdAndEvaluationId(requestDTO.getStudentId(), requestDTO.getEvaluationId()));
        return transcript;
    }

    public TranscriptResponseDTO transcriptToResponseDTO(Transcript transcript) {
        TranscriptResponseDTO responseDTO = new TranscriptResponseDTO();
        responseDTO.setId(transcript.getId());
        responseDTO.setStudent(classMapper.studentToStudentInClassDTo(transcript.getStudent()));
        responseDTO.setAverage(transcript.getAverage());
        responseDTO.setEvaluation(transcript.getEvaluation());
        responseDTO.setUpdateDate(transcript.getUpdateDate());
        responseDTO.setGenerateDate(transcript.getGeneratedDate());
        responseDTO.setGrades(gradeListToGradeInTranscriptDTOList(transcript.getGrades()));
        responseDTO.setRanking(studentService.getStudentRanking(transcript.getStudent().getId()));
        responseDTO.setAnneeAcademique(transcript.getEvaluation().getAnneeAcademique());
        return responseDTO;
    }
    public GradeInTranscriptDTO gradeToGradeInTranscriptDTO(Grade grade) {
        GradeInTranscriptDTO gradeDTO = new GradeInTranscriptDTO();
        gradeDTO.setId(grade.getId());
        gradeDTO.setComment(grade.getComment());
        gradeDTO.setSubjectName(grade.getSubject().getName());
        gradeDTO.setNoteValue(grade.getValue());
        return gradeDTO;
    }

    public List<GradeInTranscriptDTO> gradeListToGradeInTranscriptDTOList(List<Grade> gradeList) {
        List<GradeInTranscriptDTO> gradeDTOList = new ArrayList<>();
        for(Grade grade : gradeList) {
            gradeDTOList.add(gradeToGradeInTranscriptDTO(grade));
        }
        return gradeDTOList;
    }

    public List<TranscriptResponseDTO> transcriptListToResponseDTOList(List<Transcript> transcriptList) {
        List<TranscriptResponseDTO> responseDTOList = new ArrayList<>();
        for(Transcript transcript : transcriptList) {
            responseDTOList.add(transcriptToResponseDTO(transcript));
        }
        return responseDTOList;
    }

}
