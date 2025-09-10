package org.kfokam48.notemanagementbackend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.kfokam48.notemanagementbackend.dto.grade.GradeRequestDTO;
import org.kfokam48.notemanagementbackend.dto.grade.GradeResponseDTO;
import org.kfokam48.notemanagementbackend.model.Grade;
import org.kfokam48.notemanagementbackend.service.GradeService;
import org.kfokam48.notemanagementbackend.service.impl.GradeServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grades")
public class GradeController {

    private final GradeServiceImpl gradeService;

    public GradeController(GradeServiceImpl gradeService) {
        this.gradeService = gradeService;
    }


    // 🔍 Récupérer toutes les notes
    @GetMapping
    public ResponseEntity<List<GradeResponseDTO>> getAllGrades() {
        return ResponseEntity.ok(gradeService.getAllGrades());
    }

    // 🔍 Récupérer une note par ID
    @GetMapping("/{id}")
    public ResponseEntity<GradeResponseDTO> getGrade(@PathVariable Long id) {
        return ResponseEntity.ok(gradeService.getGrade(id));
    }

    // ➕ Ajouter une nouvelle note
    @PostMapping
    public ResponseEntity<GradeResponseDTO> addGrade(@RequestBody GradeRequestDTO gradeRequestDTO) {
        return ResponseEntity.ok(gradeService.addGrade(gradeRequestDTO));
    }

    // ✏️ Modifier une note existante
    @PutMapping("/{id}")
    public ResponseEntity<GradeResponseDTO> updateGrade(@RequestBody GradeRequestDTO gradeRequestDTO, @PathVariable Long id) {
        return ResponseEntity.ok(gradeService.updateGrade(id, gradeRequestDTO));
    }

    // ❌ Supprimer une note
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteGrade(@PathVariable Long id) {
        return ResponseEntity.ok(gradeService.deleteGrade(id));
    }
    @Operation(
            summary = "Lister les notes d’un étudiant",
            description = "Récupère toutes les notes associées à l’étudiant donné par son identifiant."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Liste des notes récupérée avec succès"),
            @ApiResponse(responseCode = "404", description = "Étudiant non trouvé")
    })
    @GetMapping("/students/{id}/grades")
    public ResponseEntity<List<GradeResponseDTO>> getStudentGrades(@PathVariable Long id) {
        return ResponseEntity.ok(gradeService.getGradesByStudentId(id));
    }
    @PatchMapping("/grades/{gradeId}/comment")
    public ResponseEntity<GradeResponseDTO> addComment(
            @PathVariable Long gradeId,
            @RequestParam String comment) {
        return ResponseEntity.ok(gradeService.updateGradeComment(gradeId, comment));
    }


    @Operation(
            summary = "Lister les notes d’un étudiant pour une matière donnée",
            description = "Récupère les notes d’un étudiant correspondant à une matière spécifique à partir des identifiants fournis."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Liste des notes récupérée avec succès"),
            @ApiResponse(responseCode = "404", description = "Étudiant ou matière non trouvé")
    })
    @GetMapping("/students/{studentId}/subjects/{subjectId}/grades")
    public ResponseEntity<List<GradeResponseDTO>> getGradesByStudentAndSubject(
            @PathVariable Long studentId,
            @PathVariable Long subjectId) {
        List<GradeResponseDTO> grades = gradeService.getGradesByStudentAndSubject(studentId, subjectId);
        return ResponseEntity.ok(grades);
    }

    @GetMapping("/student/{studentId}/semestre")
    public ResponseEntity<List<GradeResponseDTO>> getGradesByStudentAndSemestre(
            @PathVariable Long studentId,
            @RequestParam String semestre
    ) {
        List<GradeResponseDTO> grades = gradeService.getGradesByStudentAndTypeEvaluationName(studentId, semestre);
        return ResponseEntity.ok(grades);
    }

}
