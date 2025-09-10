package org.kfokam48.stagemanagementbackend.controlleur;

import org.kfokam48.stagemanagementbackend.minio.MinIOService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/minio")
public class MinIOController {

    private final MinIOService minIOService;

    public MinIOController(MinIOService minIOService) {
        this.minIOService = minIOService;
    }

    @GetMapping("/test")
    public ResponseEntity<String> testConnection() {
        try {
            return ResponseEntity.ok("MinIO est bien connecté !");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur de connexion à MinIO");
        }
    }
}
