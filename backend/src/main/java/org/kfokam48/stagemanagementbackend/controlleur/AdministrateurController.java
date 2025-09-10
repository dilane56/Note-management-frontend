package org.kfokam48.stagemanagementbackend.controlleur;

import org.kfokam48.stagemanagementbackend.dto.administrateur.AdministrateurDTO;
import org.kfokam48.stagemanagementbackend.dto.administrateur.AdministrateurResponseDTO;
import org.kfokam48.stagemanagementbackend.dto.administrateur.AdministrateurUpdateDTO;
import org.kfokam48.stagemanagementbackend.service.impl.AdministrateurServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/administrateurs") // URL de base du contrôleur
public class AdministrateurController {

    private final AdministrateurServiceImpl administrateurService;

    public AdministrateurController(AdministrateurServiceImpl administrateurService) {
        this.administrateurService = administrateurService;
    }


    // ✅ Récupérer un administrateur par ID
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // Accès pour les rôles ADMIN
    public ResponseEntity<AdministrateurResponseDTO> getAdministrateurById(@PathVariable Long id) {
        AdministrateurResponseDTO administrateur = administrateurService.getAdministrateurById(id);
        return ResponseEntity.ok(administrateur);
    }

    // ✅ Créer un administrateur
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')") // Accès pour les rôles ADMIN
    public ResponseEntity<AdministrateurResponseDTO> createAdministrateur(@RequestBody AdministrateurDTO administrateurDTO) {
        AdministrateurResponseDTO administrateur = administrateurService.createAdministrateur(administrateurDTO);
        return ResponseEntity.ok(administrateur);
    }

    // ✅ Mettre à jour un administrateur
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // Accès pour les rôles ADMIN
    public ResponseEntity<AdministrateurResponseDTO> updateAdministrateur(
            @PathVariable Long id,
            @RequestBody AdministrateurUpdateDTO administrateurUpdateDTO) {
        AdministrateurResponseDTO administrateur = administrateurService.updateAdministrateur(id, administrateurUpdateDTO);
        return ResponseEntity.ok(administrateur);
    }

    // ✅ Supprimer un administrateur
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // Accès pour les rôles ADMIN
    public ResponseEntity<String> deleteAdministrateur(@PathVariable Long id) {
        return administrateurService.deleteAdministrateur(id);
    }

    // ✅ Récupérer tous les administrateurs
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')") // Accès pour les rôles ADMIN
    public ResponseEntity<List<AdministrateurResponseDTO>> getAllAdministrateurs() {
        List<AdministrateurResponseDTO> administrateurs = administrateurService.getAllAdministrateurs();
        return ResponseEntity.ok(administrateurs);
    }
}
