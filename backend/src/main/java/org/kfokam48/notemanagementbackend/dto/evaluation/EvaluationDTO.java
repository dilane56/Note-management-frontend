package org.kfokam48.notemanagementbackend.dto.evaluation;

import lombok.Data;
import org.kfokam48.notemanagementbackend.enums.TypeEvaluation;


@Data
public class EvaluationDTO {
    private TypeEvaluation type;
    private String anneeAcademique;
}
