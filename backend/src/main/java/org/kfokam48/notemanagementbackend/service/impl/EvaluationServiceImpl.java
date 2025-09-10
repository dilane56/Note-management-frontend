package org.kfokam48.notemanagementbackend.service.impl;

import jakarta.transaction.Transactional;
import org.kfokam48.notemanagementbackend.dto.evaluation.EvaluationDTO;
import org.kfokam48.notemanagementbackend.dto.evaluation.EvaluationReponseDTO;
import org.kfokam48.notemanagementbackend.exception.RessourceNotFoundException;
import org.kfokam48.notemanagementbackend.mapper.EvaluationMapper;
import org.kfokam48.notemanagementbackend.model.Evaluation;
import org.kfokam48.notemanagementbackend.repository.EvaluationRepository;
import org.kfokam48.notemanagementbackend.service.EvaluationService;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@Transactional
public class EvaluationServiceImpl implements EvaluationService {
    private final EvaluationRepository evaluationRepository;
    private final EvaluationMapper evaluationMapper;

    public EvaluationServiceImpl(EvaluationRepository evaluationRepository, EvaluationMapper evaluationMapper) {
        this.evaluationRepository = evaluationRepository;
        this.evaluationMapper = evaluationMapper;
    }


    @Override
    public List<EvaluationReponseDTO> getEvaluations() {
        return evaluationMapper.evaluationToEvaluationReponseDTO(evaluationRepository.findAll());
    }

    @Override
    public EvaluationReponseDTO getEvaluation(Long id) {
        Evaluation evaluation = evaluationRepository.findById(id).orElseThrow(()->new RessourceNotFoundException("Evaluation not found"));
        return evaluationMapper.evaluationToEvaluationReponseDTO(evaluation);
    }

    @Override
    public EvaluationReponseDTO createEvaluation(EvaluationDTO evaluationDTO) {
       return evaluationMapper.evaluationToEvaluationReponseDTO(evaluationRepository.save(evaluationMapper.evaluationDTOToEvaluation(evaluationDTO)));
    }

    @Override
    public EvaluationReponseDTO updateEvaluation(Long id, EvaluationDTO evaluationDTO) {
        Evaluation evaluation = evaluationRepository.findById(id).orElseThrow(()->new RessourceNotFoundException("Evaluation not found"));
        evaluation.setSessionEvaluation(evaluationDTO.getSessionEvaluation());
        evaluation.setTypeEvaluationName(evaluationDTO.getTypeEvaluationName());
        evaluation = evaluationRepository.save(evaluation);
        return evaluationMapper.evaluationToEvaluationReponseDTO(evaluation);
    }

    @Override
    public String deleteEvaluation(Long id) {
        Evaluation evaluation = evaluationRepository.findById(id).orElseThrow(()->new RessourceNotFoundException("Evaluation not found"));
        evaluationRepository.delete(evaluation);
        return "Evaluation deleted successfully";
    }
}
