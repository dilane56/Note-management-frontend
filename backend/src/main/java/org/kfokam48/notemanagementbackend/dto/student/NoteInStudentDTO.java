package org.kfokam48.notemanagementbackend.dto.student;

import lombok.Data;
import org.kfokam48.notemanagementbackend.dto.evaluation.EvaluationReponseDTO;

@Data
public class NoteInStudentDTO {
    private double noteValue;
    private String comment;
    private String SubjectName;
    private int SubjectCoefficient;
    private EvaluationReponseDTO evaluation;
}
