package org.kfokam48.stagemanagementbackend.controlleur.auth;

import jakarta.validation.Valid;
import org.kfokam48.stagemanagementbackend.dto.auth.LoginRequest;
import org.kfokam48.stagemanagementbackend.exception.InvalidTokenException;
import org.kfokam48.stagemanagementbackend.service.auth.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {


    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> authenticateUser(@Valid @RequestBody LoginRequest authRequest) {
        Map<String, Object> response = authService.authenticateUserWithTokens(authRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<Map<String, Object>> refreshToken(@RequestBody Map<String, String> request) {
        try {
            String refreshToken = request.get("refreshToken");
            String newAccessToken = authService.refreshAccessToken(refreshToken);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("token", newAccessToken);
            return ResponseEntity.ok(response);
        } catch (InvalidTokenException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "REFRESH_TOKEN_EXPIRED");
            errorResponse.put("message", "Refresh token expiré, reconnexion requise");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Déconnexion réussie");
        return ResponseEntity.ok(response);
    }
}