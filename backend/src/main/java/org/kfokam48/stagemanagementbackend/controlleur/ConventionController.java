package org.kfokam48.stagemanagementbackend.controlleur;
import org.kfokam48.stagemanagementbackend.dto.convention.ConventionRequestDTO;
import org.kfokam48.stagemanagementbackend.dto.convention.ConventionResponseDTO;
import org.kfokam48.stagemanagementbackend.service.ConventionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/conventions") // URL de base du contrôleur
public class ConventionController {

    private final ConventionService conventionService;

    public ConventionController(ConventionService conventionService) {
        this.conventionService = conventionService;
    }

    // ✅ Récupérer une convention par ID
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ENTREPRISE') or hasRole('ADMIN') or hasRole('ENSEIGNANT')")
    public ResponseEntity<ConventionResponseDTO> findByConventionId(@PathVariable Long id) {
        ConventionResponseDTO convention = conventionService.findByConventionId(id);
        return ResponseEntity.ok(convention);
    }

    // ✅ Ajouter une nouvelle convention
    @PostMapping
    @PreAuthorize("hasRole('ENTREPRISE') or hasRole('ADMIN')")
    public ResponseEntity<ConventionResponseDTO> createConvention(
            @RequestBody ConventionRequestDTO conventionRequestDTO) throws Exception {
        return ResponseEntity.ok(conventionService.createConvention(conventionRequestDTO));
    }

    // ✅ Mettre à jour une convention
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ENTREPRISE') or hasRole('ADMIN') or hasRole('ENSEIGNANT')")
    public ResponseEntity<ConventionResponseDTO> updateConvention(
            @PathVariable Long id,
            @RequestParam("candidature-id") Long idCandidature) throws Exception {
        ConventionResponseDTO convention = conventionService.updateConvention(id, idCandidature);
        return ResponseEntity.ok(convention);
    }

    // ✅ Supprimer une convention
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteConvention(@PathVariable Long id) {
        String message = conventionService.deleteConvention(id);
        return ResponseEntity.ok(message);
    }

    // ✅ Récupérer toutes les conventions
    @GetMapping
    @PreAuthorize("hasRole('ENTREPRISE') or hasRole('ADMIN') or hasRole('ENSEIGNANT')")
    public ResponseEntity<List<ConventionResponseDTO>> findAllConventions() {
        List<ConventionResponseDTO> conventions = conventionService.findAllConventions();
        return ResponseEntity.ok(conventions);
    }

    @GetMapping("/entreprise/{entrepriseId}")
    @PreAuthorize("hasRole('ENTREPRISE') or hasRole('ADMIN')")
    public ResponseEntity<List<ConventionResponseDTO>> findConventionsByEntreprise(@PathVariable Long entrepriseId) {
        List<ConventionResponseDTO> conventions = conventionService.findConventionsByEntreprise(entrepriseId);
        return ResponseEntity.ok(conventions);
    }

    @GetMapping("/enseignant/{enseignantId}")
    @PreAuthorize("hasRole('ENSEIGNANT') or hasRole('ADMIN')")
    public ResponseEntity<List<ConventionResponseDTO>> findConventionsByEnseignant(@PathVariable Long enseignantId) {
        List<ConventionResponseDTO> conventions = conventionService.findConventionsByEnseignant(enseignantId);
        return ResponseEntity.ok(conventions);
    }

    // ✅ Valider une convention par un enseignant
    @PutMapping("/{id}/valider-enseignant/{enseignantId}")
    @PreAuthorize("hasRole('ENSEIGNANT')")
    public ResponseEntity<ConventionResponseDTO> validateConventionByEnseignant(
            @PathVariable Long id, @PathVariable Long enseignantId) throws Exception {

        ConventionResponseDTO convention = conventionService.validateConventionByEnseignant(enseignantId, id);
        return ResponseEntity.ok(convention);
    }

    // ✅ Approuver une convention par un administrateur
    @PutMapping("/{id}/approuver-administrateur/{adminId}")
    @PreAuthorize(" hasRole('ADMIN')")
    public ResponseEntity<ConventionResponseDTO> approuveConventionByAdministrator(
            @PathVariable Long id, @PathVariable Long adminId) throws Exception {

        ConventionResponseDTO convention = conventionService.approuveConventionByAdministrator(adminId, id);
        return ResponseEntity.ok(convention);
    }



    @GetMapping("/{id}/generate-pdf")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ENSEIGNANT') or hasRole('ENTREPRISE')")
    public ResponseEntity<byte[]> generateConventionPdf(@PathVariable Long id) throws Exception {
        return conventionService.generateConventionPdf(id);
    }

}