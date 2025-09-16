package org.kfokam48.notemanagementbackend.service.pdf;

import org.kfokam48.notemanagementbackend.dto.transcript.ZipInfoDTO;
import org.kfokam48.notemanagementbackend.exception.RessourceNotFoundException;
import org.kfokam48.notemanagementbackend.model.Class;
import org.kfokam48.notemanagementbackend.model.Student;
import org.kfokam48.notemanagementbackend.model.Transcript;
import org.kfokam48.notemanagementbackend.repository.ClassRepository;
import org.kfokam48.notemanagementbackend.repository.TranscriptRepository;
import org.kfokam48.notemanagementbackend.repository.StudentRepository;

import org.kfokam48.notemanagementbackend.service.impl.TranscriptServiceImpl;
import org.kfokam48.notemanagementbackend.service.pdf.PdfService;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
public class ZipTranscriptService {

    private final TranscriptRepository transcriptRepository;
    private final PdfService pdfService;
    private final ClassRepository classRepository;
    private final StudentRepository studentRepository;
    private final TranscriptServiceImpl transcriptService;


    public ZipTranscriptService(TranscriptRepository transcriptRepository, 
                               PdfService pdfService,
                               ClassRepository classRepository,
                               StudentRepository studentRepository,
                               TranscriptServiceImpl transcriptService) {
        this.transcriptRepository = transcriptRepository;
        this.pdfService = pdfService;
        this.classRepository = classRepository;
        this.studentRepository = studentRepository;
        this.transcriptService = transcriptService;
    }

    public byte[] generateClassTranscriptsZip(Long classId, Long evaluationId) {
        List<Student> students = studentRepository.findByStudentClassId(classId);
        
        if (students.isEmpty()) {
            throw new RessourceNotFoundException("Aucun étudiant trouvé pour la classe ID: " + classId);
        }

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
             ZipOutputStream zos = new ZipOutputStream(baos)) {

            for (Student student : students) {
                try {
                    // Créer le transcript automatiquement
                    Transcript transcript = transcriptService.createOrUpdateTranscript(student.getId(), evaluationId);
                    byte[] pdfData = pdfService.generateTranscript(transcript);
                    
                    String fileName = generateFileName(transcript);
                    
                    ZipEntry zipEntry = new ZipEntry(fileName);
                    zos.putNextEntry(zipEntry);
                    zos.write(pdfData);
                    zos.closeEntry();
                } catch (Exception e) {
                    // Ignorer les étudiants sans notes
                    continue;
                }
            }

            zos.finish();
            return baos.toByteArray();

        } catch (IOException e) {
            throw new RuntimeException("Erreur lors de la création du fichier ZIP", e);
        }
    }

    public byte[] generateSelectedStudentsTranscriptsZip(List<Long> studentIds) {
        List<Transcript> transcripts = studentIds.stream()
                .map(studentId -> transcriptRepository.findByStudentId(studentId)
                        .orElseThrow(() -> new RessourceNotFoundException("Relevé non trouvé pour l'étudiant ID: " + studentId)))
                .toList();

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
             ZipOutputStream zos = new ZipOutputStream(baos)) {

            for (Transcript transcript : transcripts) {
                // Générer le PDF pour chaque étudiant
                try {
                    byte[] pdfData = pdfService.generateTranscript(transcript);
                    
                    // Créer le nom du fichier
                    String fileName = generateFileName(transcript);
                    
                    // Ajouter le fichier au ZIP
                    ZipEntry zipEntry = new ZipEntry(fileName);
                    zos.putNextEntry(zipEntry);
                    zos.write(pdfData);
                    zos.closeEntry();
                } catch (Exception ex) {
                    continue;
                }
            }

            zos.finish();
            return baos.toByteArray();

        } catch (IOException e) {
            throw new RuntimeException("Erreur lors de la création du fichier ZIP", e);
        }
    }

    public ZipInfoDTO getClassZipInfo(Long classId) {
        Class classe = classRepository.findById(classId)
                .orElseThrow(() -> new RessourceNotFoundException("Classe non trouvée avec l'ID: " + classId));
        
        List<Transcript> transcripts = transcriptRepository.findByStudent_StudentClass_Id(classId);
        
        if (transcripts.isEmpty()) {
            throw new RessourceNotFoundException("Aucun relevé trouvé pour la classe ID: " + classId);
        }

        List<String> fileNames = transcripts.stream()
                .map(this::generateFileName)
                .toList();

        // Estimation de la taille (environ 50KB par PDF)
        long estimatedSize = transcripts.size() * 50 * 1024L;

        return new ZipInfoDTO(
                classId,
                classe.getClassName(),
                transcripts.size(),
                fileNames,
                estimatedSize,
                LocalDateTime.now(),
                "/api/v1/admin/transcripts/classes/" + classId + "/download-zip"
        );
    }

    public ZipInfoDTO getSelectedStudentsZipInfo(List<Long> studentIds) {
        List<Transcript> transcripts = studentIds.stream()
                .map(studentId -> transcriptRepository.findByStudentId(studentId)
                        .orElseThrow(() -> new RessourceNotFoundException("Relevé non trouvé pour l'étudiant ID: " + studentId)))
                .toList();

        List<String> fileNames = transcripts.stream()
                .map(this::generateFileName)
                .toList();

        // Estimation de la taille (environ 50KB par PDF)
        long estimatedSize = transcripts.size() * 50 * 1024L;

        return new ZipInfoDTO(
                null,
                "Sélection d'étudiants",
                transcripts.size(),
                fileNames,
                estimatedSize,
                LocalDateTime.now(),
                "/api/v1/admin/transcripts/students/bulk-download-zip"
        );
    }

    private String generateFileName(Transcript transcript) {
        String lastName = transcript.getStudent().getLastName().replaceAll("[^a-zA-Z0-9]", "_");
        String firstName = transcript.getStudent().getFirstName().replaceAll("[^a-zA-Z0-9]", "_");
        String academicYear = transcript.getEvaluation().getAnneeAcademique().replaceAll("[^a-zA-Z0-9]", "_");
        
        return String.format("Releve_%s_%s_%s.pdf", lastName, firstName, academicYear);
    }
}