package org.kfokam48.notemanagementbackend.dto.auth;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
    // + Getters/Setters
}
