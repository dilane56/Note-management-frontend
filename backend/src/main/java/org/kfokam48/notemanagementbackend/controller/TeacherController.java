package org.kfokam48.notemanagementbackend.controller;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.kfokam48.notemanagementbackend.dto.classes.ClassResponseDTO;
import org.kfokam48.notemanagementbackend.dto.teacher.TeacherClassDTO;
import org.kfokam48.notemanagementbackend.dto.teacher.TeacherDTO;
import org.kfokam48.notemanagementbackend.dto.teacher.TeacherResponseDTO;
import org.kfokam48.notemanagementbackend.service.impl.TeacherServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teachers")
public class TeacherController {

    private final TeacherServiceImpl teacherService;

    public TeacherController(TeacherServiceImpl teacherService) {
        this.teacherService = teacherService;
    }


    // 🔍 Récupérer tous les enseignants
    @GetMapping
    public ResponseEntity<List<TeacherResponseDTO>> getAllTeachers() {
        return ResponseEntity.ok(teacherService.getTeachers());
    }

    // 🔍 Récupérer un enseignant par ID
    @GetMapping("/{id}")
    public ResponseEntity<TeacherResponseDTO> getTeacherById(@PathVariable Long id) {
        return ResponseEntity.ok(teacherService.getTeacherById(id));
    }

    // ➕ Ajouter un nouvel enseignant
    @PostMapping
    public ResponseEntity<TeacherResponseDTO> createTeacher(@Valid @RequestBody TeacherDTO teacherDTO) {
        return ResponseEntity.ok(teacherService.createTeacher(teacherDTO));
    }

    // ✏️ Modifier un enseignant existant
    @PutMapping("/{id}")
    public ResponseEntity<TeacherResponseDTO> updateTeacher(@RequestBody TeacherDTO teacherDTO, @PathVariable Long id) {
        return ResponseEntity.ok(teacherService.updateTeacher(id, teacherDTO));
    }

    // ❌ Supprimer un enseignant
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTeacher(@PathVariable Long id) {
        return ResponseEntity.ok(teacherService.deleteTeacher(id));
    }

//    @GetMapping("/{teacherId}/classes")
//    public ResponseEntity<List<TeacherClassDTO>> getTeacherClasses(@PathVariable Long teacherId) {
//        return ResponseEntity.ok(teacherService.getTeacherClasses(teacherId));
//    }

    @Operation(summary = "Assigner une matière à un enseignant")
    @PatchMapping("/teachers/{teacherId}/assign-subject/{subjectId}")
    public ResponseEntity<TeacherResponseDTO> assignSubjectToTeacher(
            @PathVariable Long teacherId,
            @PathVariable Long subjectId) {

        return ResponseEntity.ok(teacherService.addTeacherSubject(teacherId, subjectId));
    }


    @Operation(summary = "Lister les classes d’un enseignant")
    @GetMapping("/teachers/{teacherId}/classes")
    public ResponseEntity<List<TeacherClassDTO>> getClassesForTeacher(@PathVariable Long teacherId) {
        return ResponseEntity.ok(teacherService.getTeacherClasses(teacherId));
    }

}
