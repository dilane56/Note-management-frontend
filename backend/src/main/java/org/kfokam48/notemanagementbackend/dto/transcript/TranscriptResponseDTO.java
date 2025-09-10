package org.kfokam48.notemanagementbackend.dto.transcript;

import lombok.Data;
import org.kfokam48.notemanagementbackend.dto.classes.StudentInClassDTo;
import org.kfokam48.notemanagementbackend.dto.grade.EvaluationInGradeDTO;


import java.time.LocalDate;
import java.util.List;
@Data
public class TranscriptResponseDTO {
    private Long id;
    private String anneeAcademique;
    private double average;
    private StudentInClassDTo student;
    private List<GradeInTranscriptDTO> grades; // Notes de l'étudiant
    private LocalDate generateDate;
    private LocalDate updateDate;
    private EvaluationInGradeDTO evaluation;


}
