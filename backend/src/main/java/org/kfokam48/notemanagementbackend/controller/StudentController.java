package org.kfokam48.notemanagementbackend.controller;
import org.kfokam48.notemanagementbackend.dto.grade.GradeResponseDTO;
import org.kfokam48.notemanagementbackend.dto.student.StudentDTO;
import org.kfokam48.notemanagementbackend.dto.student.StudentResponseDTO;
import org.kfokam48.notemanagementbackend.dto.student.StudentRankingDTO;
import org.kfokam48.notemanagementbackend.service.impl.TranscriptServiceImpl;
import com.itextpdf.text.DocumentException;
import org.kfokam48.notemanagementbackend.service.impl.StudentServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentServiceImpl studentService;
    private final TranscriptServiceImpl transcriptService;

    public StudentController(StudentServiceImpl studentService, TranscriptServiceImpl transcriptService) {
        this.studentService = studentService;
        this.transcriptService = transcriptService;
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
    // 📊 Récupérer le classement d'un étudiant
    @GetMapping("/{studentId}/ranking")
    public ResponseEntity<StudentRankingDTO> getStudentRanking(@PathVariable Long studentId) {
        return ResponseEntity.ok(studentService.getStudentRanking(studentId));
    }

    // 📄 Télécharger le relevé de notes d'un étudiant
    @GetMapping("/{studentId}/evaluations/{evaluationId}/transcript/download")
    public ResponseEntity<byte[]> downloadTranscript(@PathVariable Long studentId, @PathVariable Long evaluationId) throws DocumentException {
        byte[] pdfData = transcriptService.generateEnhancedTranscriptPdf(studentId, evaluationId);
        String filename = "releve_notes_" + studentId + "_eval_" + evaluationId + "_" + System.currentTimeMillis() + ".pdf";
        return ResponseEntity.ok()
                .header("Content-Type", "application/pdf")
                .header("Content-Disposition", "attachment; filename=" + filename)
                .body(pdfData);
    }
}
