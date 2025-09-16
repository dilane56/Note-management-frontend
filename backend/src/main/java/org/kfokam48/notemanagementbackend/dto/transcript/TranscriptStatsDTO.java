package org.kfokam48.notemanagementbackend.dto.transcript;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TranscriptStatsDTO {
    private Long classId;
    private String className;
    private int totalStudents;
    private int studentsWithTranscripts;
    private double classAverage;
    private double highestAverage;
    private double lowestAverage;
    private int passedStudents;
    private int failedStudents;
    private double passRate;
}