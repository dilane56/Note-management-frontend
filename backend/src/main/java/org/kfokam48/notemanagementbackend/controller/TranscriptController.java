package org.kfokam48.notemanagementbackend.controller;

import com.itextpdf.text.DocumentException;
import org.kfokam48.notemanagementbackend.dto.transcript.TranscriptRequestDTO;
import org.kfokam48.notemanagementbackend.dto.transcript.TranscriptResponseDTO;
import org.kfokam48.notemanagementbackend.service.impl.TranscriptServiceImpl;
import org.kfokam48.notemanagementbackend.service.pdf.PdfService;
import org.kfokam48.notemanagementbackend.service.pdf.ZipTranscriptService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transcripts")
public class TranscriptController {

    private final TranscriptServiceImpl transcriptService;
    private final PdfService pdfService;
    private final ZipTranscriptService zipTranscriptService;

    public TranscriptController(TranscriptServiceImpl transcriptService, 
                               PdfService pdfService,
                               ZipTranscriptService zipTranscriptService) {
        this.transcriptService = transcriptService;
        this.pdfService = pdfService;
        this.zipTranscriptService = zipTranscriptService;
    }


    // 🔍 Récupérer tous les relevés de notes
    @GetMapping
    public ResponseEntity<List<TranscriptResponseDTO>> getAllTranscripts() {
        return ResponseEntity.ok(transcriptService.getTranscripts());
    }

    // 🔍 Récupérer un relevé de notes par ID
    @GetMapping("/{id}")
    public ResponseEntity<TranscriptResponseDTO> getTranscriptById(@PathVariable Long id) {
        return ResponseEntity.ok(transcriptService.getTranscriptById(id));
    }



    // ❌ Supprimer un relevé de notes
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTranscript(@PathVariable Long id) {
        return ResponseEntity.ok(transcriptService.deleteTranscript(id));
    }
    // 📄 Télécharger le relevé de notes d'un étudiant (Version professionnelle)
    @GetMapping("/students/{studentId}/evaluations/{evaluationId}/download")
    public ResponseEntity<byte[]> downloadStudentTranscript(@PathVariable Long studentId, @PathVariable Long evaluationId) throws DocumentException {
        byte[] pdfData = transcriptService.generateEnhancedTranscriptPdf(studentId, evaluationId);
        String filename = "releve_notes_" + studentId + "_eval_" + evaluationId + "_" + System.currentTimeMillis() + ".pdf";
        return ResponseEntity.ok()
                .header("Content-Type", "application/pdf")
                .header("Content-Disposition", "attachment; filename=" + filename)
                .body(pdfData);
    }


    // 📊 Générer le relevé de notes par classe
    @GetMapping("/class/{classId}/evaluations/{evaluationId}/download")
    public ResponseEntity<byte[]> downloadClassTranscripts(@PathVariable Long classId, @PathVariable Long evaluationId) throws DocumentException {
        byte[] pdfData = transcriptService.generateClassTranscripts(classId, evaluationId);
        String filename = "releves_classe_" + classId + "_eval_" + evaluationId + "_" + System.currentTimeMillis() + ".pdf";
        return ResponseEntity.ok()
                .header("Content-Type", "application/pdf")
                .header("Content-Disposition", "attachment; filename=" + filename)
                .body(pdfData);
    }

    // 📋 Obtenir un aperçu du relevé avant téléchargement
    @GetMapping("/students/{studentId}/evaluations/{evaluationId}/preview")
    public ResponseEntity<TranscriptResponseDTO> previewStudentTranscript(@PathVariable Long studentId, @PathVariable Long evaluationId) {
        return ResponseEntity.ok(transcriptService.getTranscriptByStudentId(studentId, evaluationId));
    }

    // 📦 Télécharger tous les relevés d'une classe en ZIP
    @GetMapping("/class/{classId}/evaluations/{evaluationId}/download-zip")
    public ResponseEntity<byte[]> downloadClassTranscriptsZip(@PathVariable Long classId, @PathVariable Long evaluationId) {
        byte[] zipData = zipTranscriptService.generateClassTranscriptsZip(classId, evaluationId);
        String filename = "releves_classe_" + classId + "_eval_" + evaluationId + "_" + System.currentTimeMillis() + ".zip";
        
        return ResponseEntity.ok()
                .header("Content-Type", "application/zip")
                .header("Content-Disposition", "attachment; filename=" + filename)
                .header("Content-Length", String.valueOf(zipData.length))
                .body(zipData);
    }
}
