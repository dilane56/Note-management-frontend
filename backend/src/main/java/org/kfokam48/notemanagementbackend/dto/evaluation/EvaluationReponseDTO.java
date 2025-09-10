package org.kfokam48.notemanagementbackend.dto.evaluation;

import lombok.Data;
import java.util.Date;

@Data
public class EvaluationReponseDTO {
    private Long Id;
    private String sessionEvaluation;
    private String TypeEvaluationName;
}
