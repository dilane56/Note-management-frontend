package org.kfokam48.notemanagementbackend.service;

import org.kfokam48.notemanagementbackend.dto.transcript.TranscriptStatsDTO;
import org.kfokam48.notemanagementbackend.exception.RessourceNotFoundException;
import org.kfokam48.notemanagementbackend.model.Class;
import org.kfokam48.notemanagementbackend.model.Transcript;
import org.kfokam48.notemanagementbackend.repository.ClassRepository;
import org.kfokam48.notemanagementbackend.repository.TranscriptRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TranscriptStatsService {

    private final TranscriptRepository transcriptRepository;
    private final ClassRepository classRepository;

    public TranscriptStatsService(TranscriptRepository transcriptRepository, ClassRepository classRepository) {
        this.transcriptRepository = transcriptRepository;
        this.classRepository = classRepository;
    }

    public TranscriptStatsDTO getClassTranscriptStats(Long classId) {
        Class classe = classRepository.findById(classId)
                .orElseThrow(() -> new RessourceNotFoundException("Class not found with ID: " + classId));

        List<Transcript> transcripts = transcriptRepository.findByStudent_StudentClass_Id(classId);
        
        if (transcripts.isEmpty()) {
            return new TranscriptStatsDTO(
                classId, 
                classe.getClassName(), 
                classe.getStudents().size(), 
                0, 
                0.0, 
                0.0, 
                0.0, 
                0, 
                0, 
                0.0
            );
        }

        int totalStudents = classe.getStudents().size();
        int studentsWithTranscripts = transcripts.size();
        
        double classAverage = transcripts.stream()
                .mapToDouble(Transcript::getAverage)
                .average()
                .orElse(0.0);
        
        double highestAverage = transcripts.stream()
                .mapToDouble(Transcript::getAverage)
                .max()
                .orElse(0.0);
        
        double lowestAverage = transcripts.stream()
                .mapToDouble(Transcript::getAverage)
                .min()
                .orElse(0.0);
        
        int passedStudents = (int) transcripts.stream()
                .filter(t -> t.getAverage() >= 10.0)
                .count();
        
        int failedStudents = studentsWithTranscripts - passedStudents;
        
        double passRate = studentsWithTranscripts > 0 ? 
                (double) passedStudents / studentsWithTranscripts * 100 : 0.0;

        return new TranscriptStatsDTO(
            classId,
            classe.getClassName(),
            totalStudents,
            studentsWithTranscripts,
            Math.round(classAverage * 100.0) / 100.0,
            Math.round(highestAverage * 100.0) / 100.0,
            Math.round(lowestAverage * 100.0) / 100.0,
            passedStudents,
            failedStudents,
            Math.round(passRate * 100.0) / 100.0
        );
    }
}