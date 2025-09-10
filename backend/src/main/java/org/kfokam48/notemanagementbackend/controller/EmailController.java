package org.kfokam48.notemanagementbackend.controller;

import org.kfokam48.notemanagementbackend.exception.RessourceNotFoundException;
import org.kfokam48.notemanagementbackend.model.Transcript;
import org.kfokam48.notemanagementbackend.repository.TranscriptRepository;
import org.kfokam48.notemanagementbackend.service.mail.EmailService;
import org.kfokam48.notemanagementbackend.service.pdf.PdfBoxService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/mails")
public class EmailController {
    private final EmailService emailService;
    private final PdfBoxService pdfBoxService;
    private final TranscriptRepository transcriptRepository;

    public EmailController(EmailService emailService, PdfBoxService pdfBoxService, TranscriptRepository transcriptRepository) {
        this.emailService = emailService;
        this.pdfBoxService = pdfBoxService;
        this.transcriptRepository = transcriptRepository;
    }

    @PostMapping("/students/{id}/send-transcript")
    public ResponseEntity<String> sendTranscriptEmail(@PathVariable Long id) {
        Transcript transcript = transcriptRepository.findByStudentId(id)
                .orElseThrow(() -> new RessourceNotFoundException("Transcript not found"));
        byte[] pdfData = pdfBoxService.generateTranscriptPdf(transcript);

        emailService.sendTranscript(transcript.getStudent().getEmail(), pdfData);
        return ResponseEntity.ok("Relevé envoyé par email !");
    }
}
