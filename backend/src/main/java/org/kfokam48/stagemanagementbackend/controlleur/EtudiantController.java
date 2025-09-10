package org.kfokam48.stagemanagementbackend.controlleur;



import org.kfokam48.stagemanagementbackend.dto.etudiant.EtudiantDTO;
import org.kfokam48.stagemanagementbackend.dto.etudiant.EtudiantResponseDTO;
import org.kfokam48.stagemanagementbackend.dto.etudiant.EtudiantUpdateDTO;
import org.kfokam48.stagemanagementbackend.service.impl.EtudiantserviceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/etudiants") // URL de base du contrôleur
public class EtudiantController {

    private final EtudiantserviceImpl etudiantService;

    public EtudiantController(EtudiantserviceImpl etudiantService) {
        this.etudiantService = etudiantService;
    }


    // ✅ Récupérer un étudiant par ID
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ETUDIANT') or hasRole('ADMIN')")
    public ResponseEntity<EtudiantResponseDTO> getEtudiantById(@PathVariable Long id) {
        EtudiantResponseDTO etudiant = etudiantService.getEtudiantById(id);
        return ResponseEntity.ok(etudiant);
    }

    // ✅ Créer un étudiant
    @PostMapping
    @PreAuthorize("hasRole('ETUDIANT') or hasRole('ADMIN')")
    public ResponseEntity<EtudiantResponseDTO> createEtudiant(@RequestBody EtudiantDTO etudiantDTO) {
        EtudiantResponseDTO etudiant = etudiantService.createEtudiant(etudiantDTO);
        return ResponseEntity.ok(etudiant);
    }

    // ✅ Mettre à jour un étudiant
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ETUDIANT') or hasRole('ADMIN')")
    public ResponseEntity<EtudiantResponseDTO> updateEtudiant(
            @PathVariable Long id,
            @RequestBody EtudiantDTO etudiantDTO) {
        EtudiantResponseDTO etudiant = etudiantService.updateEtudiant(id, etudiantDTO);
        return ResponseEntity.ok(etudiant);
    }

    // ✅ Supprimer un étudiant
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteEtudiant(@PathVariable Long id) {
        return etudiantService.deleteEtudiant(id);
    }

    // ✅ Récupérer tous les étudiants
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EtudiantResponseDTO>> getAllEtudiants() {
        List<EtudiantResponseDTO> etudiants = etudiantService.getAllEtudiants();
        return ResponseEntity.ok(etudiants);
    }

    @GetMapping("/enseignant/{enseignantId}")
    @PreAuthorize("hasRole('ENSEIGNANT') or hasRole('ADMIN')")
    public ResponseEntity<List<EtudiantResponseDTO>> getEtudiantsByEnseignant(@PathVariable Long enseignantId) {
        List<EtudiantResponseDTO> etudiants = etudiantService.getEtudiantsByEnseignant(enseignantId);
        return ResponseEntity.ok(etudiants);
    }
}
