package org.kfokam48.notemanagementbackend.controller;

import com.itextpdf.text.DocumentException;
import org.kfokam48.notemanagementbackend.dto.transcript.TranscriptRequestDTO;
import org.kfokam48.notemanagementbackend.dto.transcript.TranscriptResponseDTO;
import org.kfokam48.notemanagementbackend.service.impl.TranscriptServiceImpl;
import org.kfokam48.notemanagementbackend.service.pdf.PdfService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transcripts")
public class TranscriptController {

    private final TranscriptServiceImpl transcriptService;
    private final PdfService pdfService;

    public TranscriptController(TranscriptServiceImpl transcriptService, PdfService pdfService) {
        this.transcriptService = transcriptService;
        this.pdfService = pdfService;
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

    // ➕ Ajouter un nouveau relevé de notes
    @PostMapping
    public ResponseEntity<TranscriptResponseDTO> createTranscript(@RequestBody TranscriptRequestDTO transcriptRequestDTO) {
        return ResponseEntity.ok(transcriptService.createTranscript(transcriptRequestDTO));
    }

    // ✏️ Modifier un relevé de notes existant
    @PutMapping("/{id}")
    public ResponseEntity<TranscriptResponseDTO> updateTranscript(@RequestBody TranscriptRequestDTO transcriptRequestDTO, @PathVariable Long id) {
        return ResponseEntity.ok(transcriptService.updateTranscript(id, transcriptRequestDTO));
    }

    // ❌ Supprimer un relevé de notes
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTranscript(@PathVariable Long id) {
        return ResponseEntity.ok(transcriptService.deleteTranscript(id));
    }
    @GetMapping("/students/{id}/transcript/download")
    public ResponseEntity<byte[]> downloadStudentTranscript(@PathVariable Long id) throws DocumentException {
        byte[] pdfData = transcriptService.generateTranscriptPdf(id);
        return ResponseEntity.ok()
                .header("Content-Type", "application/pdf")
                .header("Content-Disposition", "attachment; filename=releve_notes.pdf")
                .body(pdfData);
    }
    @PostMapping("/bulk/download")
    public ResponseEntity<byte[]> downloadBulkTranscripts(@RequestBody List<Long> studentIds) throws DocumentException {
        byte[] pdfData = pdfService.generateBulkTranscripts(studentIds);
        return ResponseEntity.ok()
                .header("Content-Type", "application/pdf")
                .header("Content-Disposition", "attachment; filename=bulk_transcripts.pdf")
                .body(pdfData);
    }
}
