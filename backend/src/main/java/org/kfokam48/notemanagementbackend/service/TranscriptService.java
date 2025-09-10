package org.kfokam48.notemanagementbackend.service;

import java.util.List;

import com.itextpdf.text.DocumentException;
import org.kfokam48.notemanagementbackend.dto.transcript.TranscriptRequestDTO;
import org.kfokam48.notemanagementbackend.dto.transcript.TranscriptResponseDTO;

public interface TranscriptService {
    public TranscriptResponseDTO getTranscriptById(Long id);
    public List<TranscriptResponseDTO> getTranscripts();
    public TranscriptResponseDTO createTranscript(TranscriptRequestDTO transcriptRequestDTO);
    public TranscriptResponseDTO updateTranscript(Long id, TranscriptRequestDTO transcriptRequestDTO);
    public String deleteTranscript(Long id);

    byte[] generateTranscriptPdf(Long studentId) throws DocumentException;
}
