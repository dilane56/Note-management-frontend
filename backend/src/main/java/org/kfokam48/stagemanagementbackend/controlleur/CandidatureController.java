package org.kfokam48.stagemanagementbackend.controlleur;

import io.swagger.v3.oas.annotations.Operation;
import org.kfokam48.stagemanagementbackend.dto.candidature.CandidatureDTO;
import org.kfokam48.stagemanagementbackend.dto.candidature.CandidatureResponseDTO;
import org.kfokam48.stagemanagementbackend.exception.RessourceNotFoundException;
import org.kfokam48.stagemanagementbackend.model.Candidature;
import org.kfokam48.stagemanagementbackend.repository.CandidatureRepository;
import org.kfokam48.stagemanagementbackend.service.impl.CandidatureServiceImpl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.List;

@RestController
@RequestMapping("/api/candidatures") // URL de base du contrôleur
public class CandidatureController {

    private final CandidatureServiceImpl candidatureService;
    private final CandidatureRepository candidatureRepository;

    public CandidatureController(CandidatureServiceImpl candidatureService, CandidatureRepository candidatureRepository) {
        this.candidatureService = candidatureService;
        this.candidatureRepository = candidatureRepository;
    }


    // ✅ Récupérer une candidature par ID
    @PreAuthorize("hasRole('ETUDIANT') or hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<CandidatureResponseDTO> getCandidatureById(@PathVariable Long id) {
        CandidatureResponseDTO candidature = candidatureService.getCandidatureById(id);
        return ResponseEntity.ok(candidature);
    }

    // ✅ Récupérer toutes les candidatures
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<CandidatureResponseDTO>> getAllCandidatures() {
        List<CandidatureResponseDTO> candidatures = candidatureService.getAllCandidatures();
        return ResponseEntity.ok(candidatures);
    }

    @GetMapping("/etudiant/{etudiantId}")
    @PreAuthorize("hasRole('ETUDIANT') or hasRole('ADMIN')")
    public ResponseEntity<List<CandidatureResponseDTO>> getCandidaturesByEtudiant(@PathVariable Long etudiantId) {
        List<CandidatureResponseDTO> candidatures = candidatureService.getCandidaturesByEtudiant(etudiantId);
        return ResponseEntity.ok(candidatures);
    }

    @GetMapping("/entreprise/{entrepriseId}")
    @PreAuthorize("hasRole('ENTREPRISE') or hasRole('ADMIN')")
    public ResponseEntity<List<CandidatureResponseDTO>> getCandidaturesByEntreprise(@PathVariable Long entrepriseId) {
        List<CandidatureResponseDTO> candidatures = candidatureService.getCandidaturesByEntreprise(entrepriseId);
        return ResponseEntity.ok(candidatures);
    }

    // ✅ Ajouter une nouvelle candidature
    @PostMapping(value = "/ajouter", consumes = "multipart/form-data")
    @Operation(summary = "Ajouter une candidature avec CV et Lettre de motivation")
    @PreAuthorize("hasRole('ETUDIANT') or hasRole('ADMIN')")
    public ResponseEntity<CandidatureResponseDTO> addCandidature(
            @RequestParam Long idEtudiant,
            @RequestParam Long idOffre,
            @RequestParam("cv") MultipartFile file,
            @RequestParam("lettreMotivation") String lettreMotivation
    ) throws Exception {

        CandidatureDTO candidatureDTO = new CandidatureDTO();
        candidatureDTO.setEtudiantId(idEtudiant);
        candidatureDTO.setOffreStageId(idOffre);
        candidatureDTO.setLettreMotivation(lettreMotivation); // ✅ injecte la vraie LM

        CandidatureResponseDTO candidatureResponseDTO = candidatureService.addCandidature(candidatureDTO, file);

        return ResponseEntity.ok(candidatureResponseDTO);
    }




//
//    @PostMapping()
//    @Operation(summary = "Ajouter une candidature sans  upload de CV")
//    public ResponseEntity<CandidatureResponseDTO> addCandidature(@RequestBody CandidatureDTO candidatureDTO) {
//        return ResponseEntity.ok(candidatureService.addCandidature(candidatureDTO));
//    }


    // ✅ Mettre à jour une candidature avec fichier
    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    @PreAuthorize("hasRole('ETUDIANT') or hasRole('ADMIN')")
    public ResponseEntity<CandidatureResponseDTO> updateCandidature(
            @PathVariable Long id,
            @RequestParam Long idEtudiant,
            @RequestParam Long idOffre,
            @RequestParam String lettreMotivation,
            @RequestParam(value = "cv", required = false) MultipartFile file) throws Exception {
        CandidatureResponseDTO candidature = candidatureService.updateCandidature(id, idEtudiant, idOffre, lettreMotivation, file);
        return ResponseEntity.ok(candidature);
    }


    // ✅ Supprimer une candidature
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ETUDIANT') or hasRole('ADMIN')")
    public ResponseEntity<String> deleteCandidature(@PathVariable Long id) {
        return candidatureService.deleteCandidature(id);
    }


    @GetMapping("/downloadCV/{id}/cv")
    public ResponseEntity<byte[]> getCv(@PathVariable Long id) throws IOException {
        Candidature candidature = candidatureRepository.findById(id).orElseThrow(()->new RessourceNotFoundException("Candidature non trouvable"));
        String fileUrl = candidature.getCvPath();

        InputStream inputStream = new URL(fileUrl.replace("\\", "/")).openStream();
        byte[] fileBytes = inputStream.readAllBytes();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);

        return ResponseEntity.ok().headers(headers).body(fileBytes);
    }

//
//    @PostMapping(value = "/add-cv", consumes = "multipart/form-data")
//    @Operation(summary = "Ajouter CV a une candidature")
//    public ResponseEntity<String> uploadCv(@RequestParam("file") MultipartFile file, @RequestParam Long id) throws Exception {
//        return candidatureService.uploadImage(file, id);
//
//    }

    @PutMapping("/{id}/statut")
    @PreAuthorize("hasRole('ENTREPRISE') or hasRole('ADMIN')")
    public ResponseEntity<String> updateCandidatureStatut(
            @PathVariable Long id,
            @RequestParam String statut,
            @RequestParam(required = false) String message) throws IOException {

        return candidatureService.updateCandidatureStatut(id, statut, message);
    }
}
