package org.kfokam48.notemanagementbackend.dto.grade;

import lombok.Data;

@Data
public class GradeRequestDTO {
    private double noteValue;
    private Long studentID;
    private Long SubjectID;
    private Long evaluationId;
   // private String comment;
}
