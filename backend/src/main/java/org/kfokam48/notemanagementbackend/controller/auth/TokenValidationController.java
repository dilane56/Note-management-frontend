package org.kfokam48.notemanagementbackend.controller.auth;

import org.kfokam48.notemanagementbackend.dto.ErrorResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class TokenValidationController {

    @GetMapping("/validate-token")
    public ResponseEntity<?> validateToken() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication != null && authentication.isAuthenticated() && 
            !authentication.getName().equals("anonymousUser")) {
            
            Map<String, Object> response = new HashMap<>();
            response.put("valid", true);
            response.put("username", authentication.getName());
            response.put("authorities", authentication.getAuthorities());
            response.put("timestamp", LocalDateTime.now());
            
            return ResponseEntity.ok(response);
        } else {
            ErrorResponseDTO errorResponse = new ErrorResponseDTO(
                LocalDateTime.now(),
                401,
                "Unauthorized",
                "Token invalide ou expiré",
                "/api/auth/validate-token",
                "INVALID_TOKEN"
            );
            return ResponseEntity.status(401).body(errorResponse);
        }
    }

    @GetMapping("/user-info")
    public ResponseEntity<?> getUserInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication != null && authentication.isAuthenticated() && 
            !authentication.getName().equals("anonymousUser")) {
            
            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("username", authentication.getName());
            userInfo.put("roles", authentication.getAuthorities());
            userInfo.put("authenticated", true);
            userInfo.put("timestamp", LocalDateTime.now());
            
            return ResponseEntity.ok(userInfo);
        } else {
            ErrorResponseDTO errorResponse = new ErrorResponseDTO(
                LocalDateTime.now(),
                401,
                "Unauthorized",
                "Utilisateur non authentifié",
                "/api/auth/user-info",
                "NOT_AUTHENTICATED"
            );
            return ResponseEntity.status(401).body(errorResponse);
        }
    }
}