package org.kfokam48.stagemanagementbackend.controlleur;
import org.kfokam48.stagemanagementbackend.dto.enseigant.EnseignantDTO;
import org.kfokam48.stagemanagementbackend.dto.enseigant.EnseignantResponseDTO;
import org.kfokam48.stagemanagementbackend.dto.enseigant.EnseignantUpdateDTO;
import org.kfokam48.stagemanagementbackend.service.impl.EnseignantServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enseignants") // URL de base du contrôleur
public class EnseignantController {

    private final EnseignantServiceImpl enseignantService;

    public EnseignantController(EnseignantServiceImpl enseignantService) {
        this.enseignantService = enseignantService;
    }


    // ✅ Récupérer un enseignant par ID
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ENSEIGNANT')") // Accès pour les rôles ADMIN
    public ResponseEntity<EnseignantResponseDTO> getEnseignantById(@PathVariable Long id) {
        EnseignantResponseDTO enseignant = enseignantService.getEnseignantById(id);
        return ResponseEntity.ok(enseignant);
    }

    // ✅ Créer un enseignant
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')") // Accès pour les rôles ADMIN
    public ResponseEntity<EnseignantResponseDTO> createEnseignant(@RequestBody EnseignantDTO enseignantDTO) {
        EnseignantResponseDTO enseignant = enseignantService.createEnseignant(enseignantDTO);
        return ResponseEntity.ok(enseignant);
    }

    // ✅ Mettre à jour un enseignant
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ENSEIGNANT') or hasRole('ADMIN')")
    public ResponseEntity<EnseignantResponseDTO> updateEnseignant(
            @PathVariable Long id,
            @RequestBody EnseignantDTO enseignantUpdateDTO) {
        EnseignantResponseDTO enseignant = enseignantService.updateEnseignant(id, enseignantUpdateDTO);
        return ResponseEntity.ok(enseignant);
    }

    // ✅ Supprimer un enseignant
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteEnseignant(@PathVariable Long id) {
        return enseignantService.deleteEnseignant(id);
    }

    // ✅ Récupérer tous les enseignants
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EnseignantResponseDTO>> getAllEnseignants() {
        List<EnseignantResponseDTO> enseignants = enseignantService.getAllEnseignants();
        return ResponseEntity.ok(enseignants);
    }
}
