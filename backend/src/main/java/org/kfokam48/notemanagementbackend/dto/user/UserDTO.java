package org.kfokam48.notemanagementbackend.dto.user;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserDTO {

    @NotNull(message = "Le password ne peut pas être null")
    @NotEmpty(message = "Le password ne peut pas être vide")
    private String password;
    private String firstName;
    private String lastName;
    @NotNull(message = "L'email ne peut pas être null")
    @NotEmpty(message = "L'email ne peut pas être vide")
    private String email;
}
