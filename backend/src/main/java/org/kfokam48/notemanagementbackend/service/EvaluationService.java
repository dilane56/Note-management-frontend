package org.kfokam48.notemanagementbackend.service;

import org.kfokam48.notemanagementbackend.dto.evaluation.EvaluationDTO;
import org.kfokam48.notemanagementbackend.dto.evaluation.EvaluationReponseDTO;

import java.util.List;

public interface EvaluationService {
    public List<EvaluationReponseDTO> getEvaluations();
    EvaluationReponseDTO getEvaluation(Long id);
    public EvaluationReponseDTO createEvaluation(EvaluationDTO evaluationDTO);
    public EvaluationReponseDTO updateEvaluation(Long id, EvaluationDTO evaluationDTO);
    public String deleteEvaluation(Long id);
}
