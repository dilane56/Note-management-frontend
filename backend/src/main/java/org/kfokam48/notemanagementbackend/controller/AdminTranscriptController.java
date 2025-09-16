package org.kfokam48.notemanagementbackend.controller;

import org.kfokam48.notemanagementbackend.dto.transcript.TranscriptResponseDTO;
import org.kfokam48.notemanagementbackend.dto.transcript.TranscriptStatsDTO;
import org.kfokam48.notemanagementbackend.dto.transcript.ZipInfoDTO;
import org.kfokam48.notemanagementbackend.service.TranscriptStatsService;
import org.kfokam48.notemanagementbackend.service.impl.TranscriptServiceImpl;
import org.kfokam48.notemanagementbackend.service.pdf.ZipTranscriptService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/transcripts")
@PreAuthorize("hasRole('ADMIN')")
public class AdminTranscriptController {

    private final TranscriptServiceImpl transcriptService;
    private final TranscriptStatsService transcriptStatsService;
    private final ZipTranscriptService zipTranscriptService;

    public AdminTranscriptController(TranscriptServiceImpl transcriptService, 
                                   TranscriptStatsService transcriptStatsService,
                                   ZipTranscriptService zipTranscriptService) {
        this.transcriptService = transcriptService;
        this.transcriptStatsService = transcriptStatsService;
        this.zipTranscriptService = zipTranscriptService;
    }



    // 📈 Statistiques des relevés par classe
    @GetMapping("/classes/{classId}/stats")
    public ResponseEntity<TranscriptStatsDTO> getClassTranscriptStats(@PathVariable Long classId) {
        TranscriptStatsDTO stats = transcriptStatsService.getClassTranscriptStats(classId);
        return ResponseEntity.ok(stats);
    }




    // 📊 Informations sur le ZIP d'une classe avant téléchargement
    @GetMapping("/classes/{classId}/zip-info")
    public ResponseEntity<ZipInfoDTO> getClassZipInfo(@PathVariable Long classId) {
        ZipInfoDTO zipInfo = zipTranscriptService.getClassZipInfo(classId);
        return ResponseEntity.ok(zipInfo);
    }


}