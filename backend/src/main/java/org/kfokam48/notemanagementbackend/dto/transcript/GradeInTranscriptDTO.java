package org.kfokam48.notemanagementbackend.dto.transcript;


import lombok.Data;
import org.kfokam48.notemanagementbackend.dto.grade.EvaluationInGradeDTO;

@Data
public class GradeInTranscriptDTO {

    private double noteValue;
    private String comment;
    private String subjectName;



}
