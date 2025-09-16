package org.kfokam48.notemanagementbackend.dto.grade;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TeacherGradeRequestDTO {

    private Long studentId;
    @NotNull(message = "Note value is required")
    private double noteValue;
    private Long evaluationId;
    private String comment;
}