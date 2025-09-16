package org.kfokam48.notemanagementbackend.service.impl;

import jakarta.transaction.Transactional;
import org.kfokam48.notemanagementbackend.dto.evaluation.EvaluationDTO;
import org.kfokam48.notemanagementbackend.dto.evaluation.EvaluationReponseDTO;
import org.kfokam48.notemanagementbackend.enums.TypeEvaluation;
import org.kfokam48.notemanagementbackend.exception.DuplicateEvaluationException;
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
    public Evaluation addEvaluation(TypeEvaluation type, String anneeAcademique) {
        // Vérifier si déjà existant
        evaluationRepository.findByTypeAndAnneeAcademique(type, anneeAcademique)
                .ifPresent(e -> {
                    throw new DuplicateEvaluationException(
                            "Une évaluation de type " + type +
                                    " existe déjà pour l'année académique " + anneeAcademique
                    );
                });

        // Sauvegarder
        Evaluation evaluation = new Evaluation();
        evaluation.setType(type);
        evaluation.setAnneeAcademique(anneeAcademique);

        return evaluationRepository.save(evaluation);
    }



    @Override
    public Evaluation updateEvaluation(Long id, EvaluationDTO evaluationDTO) {
        Evaluation evaluation = evaluationRepository.findById(id).orElseThrow(()->new RessourceNotFoundException("Evaluation not found"));
        evaluation.setType(evaluationDTO.getType());
        evaluation.setAnneeAcademique(evaluationDTO.getAnneeAcademique());
        evaluation = evaluationRepository.save(evaluation);
        return evaluation;
    }

    @Override
    public String deleteEvaluation(Long id) {
        Evaluation evaluation = evaluationRepository.findById(id).orElseThrow(()->new RessourceNotFoundException("Evaluation not found"));
        evaluationRepository.delete(evaluation);
        return "Evaluation deleted successfully";
    }
}
