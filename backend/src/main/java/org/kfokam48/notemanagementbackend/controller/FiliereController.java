package org.kfokam48.notemanagementbackend.controller;
import org.kfokam48.notemanagementbackend.dto.filiere.FiliereRequestDTO;
import org.kfokam48.notemanagementbackend.dto.filiere.FiliereResponseDTO;
import org.kfokam48.notemanagementbackend.service.impl.FiliereServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/filieres")
public class FiliereController {

    private final FiliereServiceImpl filiereService;

    public FiliereController(FiliereServiceImpl filiereService) {
        this.filiereService = filiereService;
    }


    // 🔍 Récupérer toutes les filières
    @GetMapping
    public ResponseEntity<List<FiliereResponseDTO>> getAllFilieres() {
        return ResponseEntity.ok(filiereService.getAllFilieres());
    }

    // 🔍 Récupérer une filière par ID
    @GetMapping("/{id}")
    public ResponseEntity<FiliereResponseDTO> getFiliere(@PathVariable Long id) {
        return ResponseEntity.ok(filiereService.getFiliere(id));
    }

    // ➕ Ajouter une nouvelle filière
    @PostMapping
    public ResponseEntity<FiliereResponseDTO> createFiliere(@RequestBody FiliereRequestDTO filiereRequestDTO) {
        return ResponseEntity.ok(filiereService.createFiliere(filiereRequestDTO));
    }

    // ✏️ Modifier une filière existante
    @PutMapping("/{id}")
    public ResponseEntity<FiliereResponseDTO> updateFiliere(@RequestBody FiliereRequestDTO filiereRequestDTO, @PathVariable Long id) {
        return ResponseEntity.ok(filiereService.updateFiliere(filiereRequestDTO, id));
    }

    // ❌ Supprimer une filière
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFiliere(@PathVariable Long id) {
        return ResponseEntity.ok(filiereService.deleteFiliere(id));
    }
}