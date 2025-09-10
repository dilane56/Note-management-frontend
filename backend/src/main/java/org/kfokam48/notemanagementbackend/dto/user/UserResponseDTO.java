package org.kfokam48.notemanagementbackend.dto.user;

import org.kfokam48.notemanagementbackend.enums.Roles;

import lombok.Data;
@Data
public class UserResponseDTO {
    private Long id;
    private String password;
    private String firstName;
    private String lastName;
    private String email;
    private Roles role;
}
