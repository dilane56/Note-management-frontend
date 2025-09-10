package org.kfokam48.stagemanagementbackend.controlleur;

import org.kfokam48.stagemanagementbackend.dto.offreStage.CompetenceAddDTO;
import org.kfokam48.stagemanagementbackend.dto.offreStage.OffreStageDTO;
import org.kfokam48.stagemanagementbackend.dto.offreStage.OffreStageResponseDTO;
import org.kfokam48.stagemanagementbackend.model.OffreStage;
import org.kfokam48.stagemanagementbackend.service.impl.OffreStageServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/offres-stage") // URL de base du contrôleur
public class OffreStageController {

    private final OffreStageServiceImpl offreStageService;

    public OffreStageController(OffreStageServiceImpl offreStageService) {
        this.offreStageService = offreStageService;
    }


    // ✅ Récupérer une offre de stage par ID
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ENTREPRISE') or hasRole('ADMIN') or hasRole('ETUDIANT')")
    public ResponseEntity<OffreStageResponseDTO> getOffreStageById(@PathVariable Long id) {
        OffreStageResponseDTO offreStage = offreStageService.getOffreStageById(id);
        return ResponseEntity.ok(offreStage);
    }

    // ✅ Créer une nouvelle offre de stage
    @PostMapping
    @PreAuthorize("hasRole('ENTREPRISE') or hasRole('ADMIN')")
    public ResponseEntity<OffreStageResponseDTO> createOffreStage(@RequestBody OffreStageDTO offreStageDTO) {
        OffreStageResponseDTO offreStage = offreStageService.createOffreStage(offreStageDTO);
        return ResponseEntity.ok(offreStage);
    }
    @GetMapping("/filtrer")
    @PreAuthorize("hasRole('ENTREPRISE') or hasRole('ADMIN') or hasRole('ETUDIANT')")
    public ResponseEntity<List<OffreStageResponseDTO>> filterOffresStage(
            @RequestParam(required = false) String localisation,
            @RequestParam(required = false) Integer duree,
            @RequestParam(required = false) String secteurNom) {

        List<OffreStageResponseDTO> offres = offreStageService.filterOffresStage(
                localisation,
                duree,
                secteurNom);

        return ResponseEntity.ok(offres);
    }

    // ✅ Mettre à jour une offre de stage
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ENTREPRISE') or hasRole('ADMIN')")
    public ResponseEntity<OffreStageResponseDTO> updateOffreStage(
            @PathVariable Long id,
            @RequestBody OffreStageDTO offreStageDTO) {
        OffreStageResponseDTO offreStage = offreStageService.updateOffreStage(id, offreStageDTO);
        return ResponseEntity.ok(offreStage);
    }

    // ✅ Supprimer une offre de stage
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteOffreStageById(@PathVariable Long id) {
        return offreStageService.deleteOffreStageById(id);
    }

    // ✅ Récupérer toutes les offres de stage
    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('ETUDIANT') or hasRole('ENSEIGNANT')")
    public ResponseEntity<List<OffreStageResponseDTO>> getAllOffresStage() {
        List<OffreStageResponseDTO> offresStage = offreStageService.getAllOffresStage();
        return ResponseEntity.ok(offresStage);
    }

    @GetMapping("/entreprise/{entrepriseId}")
    @PreAuthorize("hasRole('ENTREPRISE') or hasRole('ADMIN')")
    public ResponseEntity<List<OffreStageResponseDTO>> getOffresByEntreprise(@PathVariable Long entrepriseId) {
        List<OffreStageResponseDTO> offres = offreStageService.getOffresByEntreprise(entrepriseId);
        return ResponseEntity.ok(offres);
    }

    @PostMapping("/{id}/competences")
    public ResponseEntity<OffreStageResponseDTO> addCompetence(@PathVariable Long id, @RequestBody CompetenceAddDTO dto) {
        OffreStageResponseDTO updated = offreStageService.addCompetence( dto.getNomCompetence(), id);
        return ResponseEntity.ok(updated);
    }
}
