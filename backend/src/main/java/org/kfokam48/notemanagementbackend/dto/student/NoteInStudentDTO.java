package org.kfokam48.notemanagementbackend.dto.student;

import lombok.Data;

import org.kfokam48.notemanagementbackend.model.Evaluation;

@Data
public class NoteInStudentDTO {
    private Long noteId;
    private double noteValue;
    private String comment;
    private String SubjectName;
    private Long subjectId;
    private double SubjectCoefficient;
    private Evaluation evaluationReponse;
}
