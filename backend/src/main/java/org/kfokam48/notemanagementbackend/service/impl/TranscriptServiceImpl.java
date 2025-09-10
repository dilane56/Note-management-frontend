package org.kfokam48.notemanagementbackend.service.impl;

import com.itextpdf.text.DocumentException;
import jakarta.transaction.Transactional;
import org.kfokam48.notemanagementbackend.dto.transcript.TranscriptRequestDTO;
import org.kfokam48.notemanagementbackend.dto.transcript.TranscriptResponseDTO;
import org.kfokam48.notemanagementbackend.exception.ResourceAlreadyExistException;
import org.kfokam48.notemanagementbackend.exception.RessourceNotFoundException;
import org.kfokam48.notemanagementbackend.mapper.TranscriptMapper;
import org.kfokam48.notemanagementbackend.model.Grade;
import org.kfokam48.notemanagementbackend.model.Transcript;
import org.kfokam48.notemanagementbackend.repository.StudentRepository;
import org.kfokam48.notemanagementbackend.repository.TranscriptRepository;
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

    public TranscriptServiceImpl(TranscriptRepository transcriptRepository, TranscriptMapper transcriptMapper, StudentRepository studentRepository, PdfService pdfService) {
        this.transcriptRepository = transcriptRepository;
        this.transcriptMapper = transcriptMapper;
        this.studentRepository = studentRepository;
        this.pdfService = pdfService;
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

    @Override
    public TranscriptResponseDTO createTranscript(TranscriptRequestDTO transcriptRequestDTO) {
        if(transcriptRepository.findByStudentIdAndEvaluationId(transcriptRequestDTO.getStudentId(), transcriptRequestDTO.getEvaluationId()).isPresent()){
            throw new ResourceAlreadyExistException("A transcript with this student and Evaluation already exists");
        }
        Transcript transcript = transcriptMapper.transcriptRequestDTOToTranscript(transcriptRequestDTO);
        List<Grade> grades = transcript.getGrades();
        // 🧮 Calcul de la moyenne
        double average = grades.stream()
                .mapToDouble(Grade::getValue)
                .average()
                .orElse(0.0);
        transcript.setGeneratedDate(LocalDate.now());
        transcript.setAverage(average);
        Transcript saveTranscript = transcriptRepository.save(transcript);
        return transcriptMapper.transcriptToResponseDTO(transcript);
    }

    @Override
    public TranscriptResponseDTO updateTranscript(Long id, TranscriptRequestDTO transcriptRequestDTO) {
        Transcript transcript = transcriptRepository.findById(id).orElseThrow(()->new RessourceNotFoundException("Transcript not found"));
        transcript.setAcademicYear(transcriptRequestDTO.getAcademicYear());
        transcript.setStudent(studentRepository.findById(transcriptRequestDTO.getStudentId()).orElseThrow(()->new RessourceNotFoundException("Student not found")));
        transcript.setUpdateDate(LocalDate.now());
        transcriptRepository.save(transcript);
        return transcriptMapper.transcriptToResponseDTO(transcript);
    }

    @Override
    public String deleteTranscript(Long id) {
        Transcript transcript = transcriptRepository.findById(id).orElseThrow(()->new RessourceNotFoundException("Transcript not found"));
        transcriptRepository.delete(transcript);
        return "Transcript deleted Successfully";
    }
    @Override
    public byte[] generateTranscriptPdf(Long studentId) throws DocumentException {
        Transcript transcript = transcriptRepository.findByStudentId(studentId)
                .orElseThrow(() -> new RessourceNotFoundException("Transcript not found"));

        return pdfService.generateTranscript(transcript);
    }
}
