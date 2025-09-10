package org.kfokam48.notemanagementbackend.controller;
import org.kfokam48.notemanagementbackend.dto.classes.ClassRequestDTO;
import org.kfokam48.notemanagementbackend.dto.classes.ClassResponseDTO;
import org.kfokam48.notemanagementbackend.service.impl.ClassServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classes") // Définition du point d'accès
public class ClassController {

    private final ClassServiceImpl classService;

    public ClassController(ClassServiceImpl classService) {
        this.classService = classService;
    }


    // 🔍 Récupérer toutes les classes
    @GetMapping
    public ResponseEntity<List<ClassResponseDTO>> getAllClasses() {
        return ResponseEntity.ok(classService.getAll());
    }

    // 🔍 Récupérer une classe par ID
    @GetMapping("/{id}")
    public ResponseEntity<ClassResponseDTO> getClassById(@PathVariable Long id) {
        return ResponseEntity.ok(classService.getById(id));
    }

    // ➕ Ajouter une nouvelle classe
    @PostMapping
    public ResponseEntity<ClassResponseDTO> createClass(@RequestBody ClassRequestDTO classRequestDTO) {
        return ResponseEntity.ok(classService.save(classRequestDTO));
    }

    // ✏️ Modifier une classe existante
    @PutMapping("/{id}")
    public ResponseEntity<ClassResponseDTO> updateClass(@RequestBody ClassRequestDTO classRequestDTO, @PathVariable Long id) {
        return ResponseEntity.ok(classService.update(classRequestDTO, id));
    }

    // ❌ Supprimer une classe
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteClass(@PathVariable Long id) {
        return ResponseEntity.ok(classService.deleteById(id));
    }
}
