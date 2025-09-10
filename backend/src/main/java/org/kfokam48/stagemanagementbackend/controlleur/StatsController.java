package org.kfokam48.stagemanagementbackend.controlleur;

import org.kfokam48.stagemanagementbackend.dto.stats.*;
import org.kfokam48.stagemanagementbackend.enums.Roles;
import org.kfokam48.stagemanagementbackend.model.Utilisateur;
import org.kfokam48.stagemanagementbackend.repository.UtilisateurRepository;
import org.kfokam48.stagemanagementbackend.service.StatsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    private final StatsService statsService;
    private final UtilisateurRepository utilisateurRepository;

    public StatsController(StatsService statsService, UtilisateurRepository utilisateurRepository) {
        this.statsService = statsService;
        this.utilisateurRepository = utilisateurRepository;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats(Authentication authentication) {
        String email = authentication.getName();
        Utilisateur user = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);

        Object stats = switch (user.getRole()) {
            case ETUDIANT -> statsService.getEtudiantStats(user.getId());
            case ENTREPRISE -> statsService.getEntrepriseStats(user.getId());
            case ENSEIGNANT -> statsService.getEnseignantStats(user.getId());
            case ADMIN -> statsService.getAdminStats();
        };

        response.put("data", stats);
        return ResponseEntity.ok(response);
    }
}