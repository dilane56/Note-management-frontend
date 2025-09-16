package org.kfokam48.notemanagementbackend.dto.grade;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class GradeRequestDTO {
    @NotNull(message = "Note value is required")
    private double noteValue;
    private Long studentID;
    private Long SubjectID;
    private Long evaluationId;
   // private String comment;
}
