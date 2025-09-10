package org.kfokam48.notemanagementbackend.dto.grade;

import lombok.Data;
import org.kfokam48.notemanagementbackend.dto.classes.StudentInClassDTo;
@Data
public class GradeResponseDTO {
    private Long gradeId;
    private double noteValue;
    private String comment;
    private StudentInClassDTo student;
    private String subjectName;
    private EvaluationInGradeDTO evaluation;

}
