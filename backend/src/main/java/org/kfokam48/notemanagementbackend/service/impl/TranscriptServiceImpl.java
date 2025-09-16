package org.kfokam48.notemanagementbackend.service.impl;

import com.itextpdf.text.DocumentException;
import jakarta.transaction.Transactional;
import org.kfokam48.notemanagementbackend.dto.transcript.TranscriptRequestDTO;
import org.kfokam48.notemanagementbackend.dto.transcript.TranscriptResponseDTO;
import org.kfokam48.notemanagementbackend.exception.ResourceAlreadyExistException;
import org.kfokam48.notemanagementbackend.exception.RessourceNotFoundException;
import org.kfokam48.notemanagementbackend.mapper.TranscriptMapper;
import org.kfokam48.notemanagementbackend.model.Grade;
import org.kfokam48.notemanagementbackend.model.Student;
import org.kfokam48.notemanagementbackend.model.Transcript;
import org.kfokam48.notemanagementbackend.repository.StudentRepository;
import org.kfokam48.notemanagementbackend.repository.TranscriptRepository;
import org.kfokam48.notemanagementbackend.repository.EvaluationRepository;
import org.kfokam48.notemanagementbackend.repository.GradeRepository;
import org.kfokam48.notemanagementbackend.service.TranscriptService;
import org.kfokam48.notemanagementbackend.service.pdf.PdfBoxService;
import org.kfokam48.notemanagementbackend.service.pdf.PdfService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
@Service
@Transactional
public class TranscriptServiceImpl implements TranscriptService {
    private final TranscriptRepository transcriptRepository;
    private final TranscriptMapper transcriptMapper;
    private final StudentRepository studentRepository;
    private final PdfService pdfService;
    private final EvaluationRepository evaluationRepository;
    private final GradeRepository gradeRepository;

    public TranscriptServiceImpl(TranscriptRepository transcriptRepository, TranscriptMapper transcriptMapper, StudentRepository studentRepository, PdfService pdfService, EvaluationRepository evaluationRepository, GradeRepository gradeRepository) {
        this.transcriptRepository = transcriptRepository;
        this.transcriptMapper = transcriptMapper;
        this.studentRepository = studentRepository;
        this.pdfService = pdfService;
        this.evaluationRepository = evaluationRepository;
        this.gradeRepository = gradeRepository;
    }


    @Override
    public TranscriptResponseDTO getTranscriptById(Long id) {
        Transcript transcript = transcriptRepository.findById(id).orElseThrow(()->new RessourceNotFoundException("Transcript not found"));
        return transcriptMapper.transcriptToResponseDTO(transcript);
    }

    @Override
    public List<TranscriptResponseDTO> getTranscripts() {
        return transcriptMapper.transcriptListToResponseDTOList(transcriptRepository.findAll());
    }

    public Transcript createOrUpdateTranscript(Long studentId, Long evaluationId) {
        // Vérifier si un relevé existe déjà pour cet étudiant et cette évaluation
        return transcriptRepository.findByStudentIdAndEvaluationId(studentId, evaluationId)
            .map(existing -> {
                // Mise à jour du relevé existant
                existing.setUpdateDate(LocalDate.now());
                return updateTranscriptData(existing);
            })
            .orElseGet(() -> {
                // Création d'un nouveau relevé
                Transcript newTranscript = new Transcript();
                newTranscript.setStudent(studentRepository.findById(studentId)
                    .orElseThrow(() -> new RessourceNotFoundException("Student not found")));
                newTranscript.setEvaluation(evaluationRepository.findById(evaluationId)
                    .orElseThrow(() -> new RessourceNotFoundException("Evaluation not found")));
                newTranscript.setGeneratedDate(LocalDate.now());
                return updateTranscriptData(newTranscript);
            });
    }

    private Transcript updateTranscriptData(Transcript transcript) {
        List<Grade> grades = gradeRepository.findByStudentIdAndEvaluationId(
            transcript.getStudent().getId(), transcript.getEvaluation().getId());
        transcript.setGrades(grades);
        double average = grades.stream().mapToDouble(Grade::getValue).average().orElse(0.0);
        transcript.setAverage(average);
        return transcriptRepository.save(transcript);
    }

    @Override
    public String deleteTranscript(Long id) {
        if (transcriptRepository.existsById(id)) {
            transcriptRepository.deleteById(id);
            return "Transcript deleted Successfully";
        }
        throw new RessourceNotFoundException("Transcript not found");
    }
    public byte[] generateTranscriptPdf(Long studentId, Long evaluationId) throws DocumentException {
        Transcript transcript = createOrUpdateTranscript(studentId, evaluationId);
        return pdfService.generateTranscript(transcript);
    }

    public byte[] generateEnhancedTranscriptPdf(Long studentId, Long evaluationId) throws DocumentException {
        Transcript transcript = createOrUpdateTranscript(studentId, evaluationId);
        return pdfService.generateTranscript(transcript);
    }

    public byte[] generateClassTranscripts(Long classId, Long evaluationId) throws DocumentException {
        List<Student> students = studentRepository.findByStudentClassId(classId);
        if (students.isEmpty()) {
            throw new RessourceNotFoundException("No students found for class ID: " + classId);
        }
        
        List<Long> studentIds = students.stream().map(Student::getId).toList();
        return pdfService.generateBulkTranscripts(studentIds);
    }

    public TranscriptResponseDTO getTranscriptByStudentId(Long studentId, Long evaluationId) {
        Transcript transcript = createOrUpdateTranscript(studentId, evaluationId);
        return transcriptMapper.transcriptToResponseDTO(transcript);
    }

    public byte[] generateBulkTranscriptsByStudentIds(List<Long> studentIds) {
        List<Transcript> transcripts = studentIds.stream()
                .map(studentId -> transcriptRepository.findByStudentId(studentId)
                        .orElseThrow(() -> new RessourceNotFoundException("Transcript not found for student ID: " + studentId)))
                .toList();

        PdfBoxService pdfBoxService = new PdfBoxService();
        return pdfBoxService.generateBulkTranscriptsPdf(transcripts);
    }
}
