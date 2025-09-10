package org.kfokam48.stagemanagementbackend.dto.auth;

import lombok.Data;

@Data
public class LoginResponse {
    private String token;
    private String role;
    // + Getters/Setters
}
