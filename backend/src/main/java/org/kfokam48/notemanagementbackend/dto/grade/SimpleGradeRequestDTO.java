package org.kfokam48.notemanagementbackend.dto.grade;

import lombok.Data;

@Data
public class SimpleGradeRequestDTO {
    private double noteValue;
    private String comment;
}