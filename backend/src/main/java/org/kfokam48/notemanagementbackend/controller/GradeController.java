package org.kfokam48.notemanagementbackend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.kfokam48.notemanagementbackend.dto.grade.GradeRequestDTO;
import org.kfokam48.notemanagementbackend.dto.grade.GradeResponseDTO;
import org.kfokam48.notemanagementbackend.dto.grade.TeacherGradeRequestDTO;
import org.kfokam48.notemanagementbackend.dto.grade.SimpleGradeRequestDTO;
import org.kfokam48.notemanagementbackend.dto.student.StudentResponseDTO;
import org.kfokam48.notemanagementbackend.dto.subject.SubjectResponseDTO;
import org.kfokam48.notemanagementbackend.enums.TypeEvaluation;
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
    public ResponseEntity<GradeResponseDTO> addGrade(@Valid @RequestBody GradeRequestDTO gradeRequestDTO) {
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
    @PatchMapping("/{gradeId}/comment")
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

    @GetMapping("/student/{studentId}/evaluation/{typeEvaluation}/grades")
    public ResponseEntity<List<GradeResponseDTO>> getGradesByStudentAndSemestre(
            @PathVariable Long studentId,
            @PathVariable String typeEvaluation) {
        List<GradeResponseDTO> grades = gradeService.getGradesByStudentAndTypeEvaluationName(studentId, TypeEvaluation.valueOf(typeEvaluation));
        return ResponseEntity.ok(grades);
    }

    @Operation(
            summary = "Ajouter une note pour une matière spécifique",
            description = "Permet à un enseignant d'ajouter une note pour un étudiant dans une matière donnée."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Note ajoutée avec succès"),
            @ApiResponse(responseCode = "404", description = "Étudiant, matière ou évaluation non trouvé")
    })
    @PostMapping("/subjects/{subjectId}/students/{studentId}/evaluations/{evaluationId}")
    public ResponseEntity<GradeResponseDTO> addGradeForSubject(
            @PathVariable Long subjectId,
            @PathVariable Long studentId,
            @PathVariable Long evaluationId,
           @Valid @RequestBody GradeRequestDTO gradeRequestDTO) {
        gradeRequestDTO.setStudentID(studentId);
        gradeRequestDTO.setSubjectID(subjectId);
        gradeRequestDTO.setEvaluationId(evaluationId);
        return ResponseEntity.ok(gradeService.addGrade(gradeRequestDTO));
    }

    @Operation(
            summary = "Ajouter une note (interface enseignant simplifiée)",
            description = "Interface simplifiée pour les enseignants : ajouter une note en spécifiant seulement la valeur, l'évaluation et un commentaire optionnel."
    )
    @PostMapping("/teacher/subjects/{subjectId}/students/{studentId}/evaluations/{evaluationId}")
    public ResponseEntity<GradeResponseDTO> addGradeByTeacher(
            @PathVariable Long subjectId,
            @PathVariable Long studentId,
            @PathVariable Long evaluationId,
            @RequestBody TeacherGradeRequestDTO teacherGradeRequest) {
        teacherGradeRequest.setEvaluationId(evaluationId);
        return ResponseEntity.ok(gradeService.addGradeWithComment(studentId, subjectId, teacherGradeRequest));
    }

    @Operation(
            summary = "Ajouter une note (interface ultra-simplifiée)",
            description = "Interface ultra-simplifiée : tous les paramètres dans l'URL, seule la note et un commentaire optionnel dans le body."
    )
    @PostMapping("/simple/subjects/{subjectId}/students/{studentId}/evaluations/{evaluationId}")
    public ResponseEntity<GradeResponseDTO> addSimpleGrade(
            @PathVariable Long subjectId,
            @PathVariable Long studentId,
            @PathVariable Long evaluationId,
            @RequestBody SimpleGradeRequestDTO simpleGradeRequest) {
        GradeRequestDTO gradeRequest = new GradeRequestDTO();
        gradeRequest.setNoteValue(simpleGradeRequest.getNoteValue());
        gradeRequest.setStudentID(studentId);
        gradeRequest.setSubjectID(subjectId);
        gradeRequest.setEvaluationId(evaluationId);
        
        GradeResponseDTO savedGrade = gradeService.addGrade(gradeRequest);
        
        if (simpleGradeRequest.getComment() != null && !simpleGradeRequest.getComment().trim().isEmpty()) {
            savedGrade = gradeService.updateGradeComment(savedGrade.getGradeId(), simpleGradeRequest.getComment());
        }
        
        return ResponseEntity.ok(savedGrade);
    }

    @Operation(
            summary = "Récupérer les étudiants d'une matière",
            description = "Récupère tous les étudiants de la classe associée à une matière donnée."
    )
    @GetMapping("/subjects/{subjectId}/students")
    public ResponseEntity<List<StudentResponseDTO>> getStudentsBySubject(@PathVariable Long subjectId) {
        return ResponseEntity.ok(gradeService.getStudentsBySubject(subjectId));
    }

    @Operation(
            summary = "Récupérer les matières d'un enseignant",
            description = "Récupère toutes les matières assignées à un enseignant."
    )
    @GetMapping("/teacher/{teacherId}/subjects")
    public ResponseEntity<List<SubjectResponseDTO>> getSubjectsByTeacher(@PathVariable Long teacherId) {
        return ResponseEntity.ok(gradeService.getSubjectsByTeacher(teacherId));
    }

}
