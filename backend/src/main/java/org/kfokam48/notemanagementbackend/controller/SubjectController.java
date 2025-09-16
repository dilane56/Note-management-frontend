package org.kfokam48.notemanagementbackend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.kfokam48.notemanagementbackend.dto.subject.SubjectRequestDTO;
import org.kfokam48.notemanagementbackend.dto.subject.SubjectResponseDTO;
import org.kfokam48.notemanagementbackend.model.Subject;
import org.kfokam48.notemanagementbackend.service.impl.SubjectServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {

    private final SubjectServiceImpl subjectService;

    public SubjectController(SubjectServiceImpl subjectService) {
        this.subjectService = subjectService;
    }


    // 🔍 Récupérer toutes les matières
    @GetMapping
    public ResponseEntity<List<SubjectResponseDTO>> getAllSubjects() {
        return ResponseEntity.ok(subjectService.getSubjects());
    }

    // 🔍 Récupérer une matière par ID
    @GetMapping("/{id}")
    public ResponseEntity<SubjectResponseDTO> getSubjectById(@PathVariable Long id) {
        return ResponseEntity.ok(subjectService.getSubjectById(id));
    }

    // ➕ Ajouter une nouvelle matière
    @PostMapping
    public ResponseEntity<SubjectResponseDTO> createSubject(@RequestBody SubjectRequestDTO subjectRequestDTO) {
        return ResponseEntity.ok(subjectService.createSubject(subjectRequestDTO));
    }

    // ✏️ Modifier une matière existante
    @PutMapping("/{id}")
    public ResponseEntity<SubjectResponseDTO> updateSubject(@RequestBody SubjectRequestDTO subjectRequestDTO, @PathVariable Long id) {
        return ResponseEntity.ok(subjectService.updateSubject(id, subjectRequestDTO));
    }

    // ❌ Supprimer une matière
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSubject(@PathVariable Long id) {
        return ResponseEntity.ok(subjectService.deleteSubject(id));
    }

    @Operation(
            summary = "Modifier le coefficient d’une matière",
            description = "Permet de modifier le coefficient d’une matière en fonction de son ID."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Coefficient mis à jour"),
            @ApiResponse(responseCode = "404", description = "Matière non trouvée")
    })
    @PatchMapping("/{id}/coefficient")
    public ResponseEntity<SubjectResponseDTO> updateCoefficient(
            @PathVariable Long id,
            @RequestParam double coefficient) {
        SubjectResponseDTO updated = subjectService.updateSubjectCoefficient(id, coefficient);
        return ResponseEntity.ok(updated);
    }

}
