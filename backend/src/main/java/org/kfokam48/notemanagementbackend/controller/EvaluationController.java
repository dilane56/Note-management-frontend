package org.kfokam48.notemanagementbackend.controller;

import org.kfokam48.notemanagementbackend.dto.evaluation.EvaluationDTO;
import org.kfokam48.notemanagementbackend.dto.evaluation.EvaluationReponseDTO;
import org.kfokam48.notemanagementbackend.model.Evaluation;
import org.kfokam48.notemanagementbackend.service.impl.EvaluationServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/evaluations") // Définition du point d'accès
public class EvaluationController {

    private final EvaluationServiceImpl evaluationService;

    public EvaluationController(EvaluationServiceImpl evaluationService) {
        this.evaluationService = evaluationService;
    }


    // 🔍 Récupérer toutes les évaluations
    @GetMapping
    public ResponseEntity<List<EvaluationReponseDTO>> getAllEvaluations() {
        return ResponseEntity.ok(evaluationService.getEvaluations());
    }

    // 🔍 Récupérer une évaluation par ID
    @GetMapping("/{id}")
    public ResponseEntity<EvaluationReponseDTO> getEvaluationById(@PathVariable Long id) {
        return ResponseEntity.ok(evaluationService.getEvaluation(id));
    }

    // ➕ Ajouter une nouvelle évaluation
    @PostMapping
    public ResponseEntity<Evaluation> createEvaluation(@RequestBody EvaluationDTO request) {
        Evaluation evaluation = evaluationService.addEvaluation(request.getType(), request.getAnneeAcademique());
        return ResponseEntity.ok(evaluation);
    }

    // ✏️ Modifier une évaluation existante
    @PutMapping("/{id}")
    public ResponseEntity<Evaluation> updateEvaluation(@RequestBody EvaluationDTO evaluationDTO, @PathVariable Long id) {
        return ResponseEntity.ok(evaluationService.updateEvaluation(id, evaluationDTO));
    }

    // ❌ Supprimer une évaluation
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEvaluation(@PathVariable Long id) {
        return ResponseEntity.ok(evaluationService.deleteEvaluation(id));
    }
}
