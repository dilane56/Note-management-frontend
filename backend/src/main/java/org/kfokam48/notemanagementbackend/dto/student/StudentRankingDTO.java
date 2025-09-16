package org.kfokam48.notemanagementbackend.dto.student;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentRankingDTO {
    private int studentRank;
    private int totalStudents;
    private double classAverage;
    private double studentAverage;
}