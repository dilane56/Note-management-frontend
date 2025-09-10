package org.kfokam48.notemanagementbackend.controller;
import org.kfokam48.notemanagementbackend.dto.grade.GradeResponseDTO;
import org.kfokam48.notemanagementbackend.dto.student.StudentDTO;
import org.kfokam48.notemanagementbackend.dto.student.StudentResponseDTO;
import org.kfokam48.notemanagementbackend.service.impl.StudentServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentServiceImpl studentService;

    public StudentController(StudentServiceImpl studentService) {
        this.studentService = studentService;
    }


    // 🔍 Récupérer tous les étudiants
    @GetMapping
    public ResponseEntity<List<StudentResponseDTO>> getAllStudents() {
        return ResponseEntity.ok(studentService.getStudents());
    }

    // 🔍 Récupérer un étudiant par ID
    @GetMapping("/{id}")
    public ResponseEntity<StudentResponseDTO> getStudentById(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getStudentById(id));
    }

    // ➕ Ajouter un nouvel étudiant
    @PostMapping
    public ResponseEntity<StudentResponseDTO> createStudent(@RequestBody StudentDTO studentDTO) {
        return ResponseEntity.ok(studentService.createStudent(studentDTO));
    }

    // ✏️ Modifier un étudiant existant
    @PutMapping("/{id}")
    public ResponseEntity<StudentResponseDTO> updateStudent(@RequestBody StudentDTO studentDTO, @PathVariable Long id) {
        return ResponseEntity.ok(studentService.updateStudent(id, studentDTO));
    }

    // ❌ Supprimer un étudiant
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteStudent(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.deleteStudent(id));
    }
//    @GetMapping("/students/{id}/grades")
//    public ResponseEntity<List<GradeResponseDTO>> getStudentGrades(@PathVariable Long id) {
//        return ResponseEntity.ok(gradeService.getGradesByStudentId(id));
//    }
}
