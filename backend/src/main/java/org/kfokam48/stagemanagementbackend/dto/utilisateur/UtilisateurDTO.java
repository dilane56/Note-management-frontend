package org.kfokam48.stagemanagementbackend.dto.utilisateur;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.kfokam48.stagemanagementbackend.model.embeded.Profile;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UtilisateurDTO {
    @NotNull(message = "L'email ne doit pas être null")
    @NotBlank(message = "L'email ne doit pas être vide")
    private String email;
    @NotNull(message = "Le mot de passe ne doit pas être null")
    @NotBlank(message = "Le mot de passe ne doit pas être vide")
    private String password;
    @NotNull(message = "Le nom complet ne doit pas être null")
    @NotBlank(message = "Le nom complet ne doit pas être vide")
    private String fullName;
    private String telephone;
    private String avatar;
    private Profile profile;
}
