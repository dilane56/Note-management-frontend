package org.kfokam48.notemanagementbackend.service;

import org.kfokam48.notemanagementbackend.dto.evaluation.EvaluationDTO;
import org.kfokam48.notemanagementbackend.dto.evaluation.EvaluationReponseDTO;
import org.kfokam48.notemanagementbackend.enums.TypeEvaluation;
import org.kfokam48.notemanagementbackend.model.Evaluation;

import java.util.List;

public interface EvaluationService {
    public List<EvaluationReponseDTO> getEvaluations();
    EvaluationReponseDTO getEvaluation(Long id);
    public Evaluation addEvaluation(TypeEvaluation type, String anneeAcademique);
    public Evaluation updateEvaluation(Long id, EvaluationDTO evaluationDTO);
    public String deleteEvaluation(Long id);
}
