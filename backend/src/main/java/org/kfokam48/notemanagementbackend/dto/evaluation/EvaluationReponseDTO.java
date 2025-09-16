package org.kfokam48.notemanagementbackend.dto.evaluation;

import lombok.Data;
import org.kfokam48.notemanagementbackend.enums.TypeEvaluation;

import java.util.Date;

@Data
public class EvaluationReponseDTO {
    private Long Id;
    private String anneeAcademique;
    private TypeEvaluation typeEvaluation;
}
