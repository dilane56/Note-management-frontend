package org.kfokam48.notemanagementbackend.mapper;

import org.kfokam48.notemanagementbackend.dto.evaluation.EvaluationDTO;
import org.kfokam48.notemanagementbackend.dto.evaluation.EvaluationReponseDTO;
import org.kfokam48.notemanagementbackend.model.Evaluation;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class EvaluationMapper {
    private final ModelMapper modelMapper;

    public EvaluationMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }


    public Evaluation evaluationDTOToEvaluation(EvaluationDTO evaluationDTO) {
        Evaluation evaluation = modelMapper.map(evaluationDTO, Evaluation.class);
        evaluation.setTypeEvaluationName(evaluationDTO.getTypeEvaluationName());
        evaluation.setSessionEvaluation(evaluationDTO.getSessionEvaluation());
        return evaluation;


    }

    public EvaluationReponseDTO evaluationToEvaluationReponseDTO(Evaluation evaluation) {
        EvaluationReponseDTO evaluationReponseDTO = modelMapper.map(evaluation, EvaluationReponseDTO.class);
       evaluationReponseDTO.setTypeEvaluationName(evaluation.getTypeEvaluationName());
        evaluationReponseDTO.setSessionEvaluation(evaluation.getSessionEvaluation());
        return evaluationReponseDTO;
    }

    public List<EvaluationReponseDTO> evaluationToEvaluationReponseDTO(List<Evaluation> evaluations) {
        List<EvaluationReponseDTO> evaluationReponseDTOs = new ArrayList<>();
        for (Evaluation evaluation : evaluations) {
            evaluationReponseDTOs.add(evaluationToEvaluationReponseDTO(evaluation));
        }
        return evaluationReponseDTOs;
    }


}
