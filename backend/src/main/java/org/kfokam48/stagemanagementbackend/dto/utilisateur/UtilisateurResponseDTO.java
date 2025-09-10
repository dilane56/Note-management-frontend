package org.kfokam48.stagemanagementbackend.dto.utilisateur;

import lombok.Data;
import org.kfokam48.stagemanagementbackend.enums.Roles;
import org.kfokam48.stagemanagementbackend.model.embeded.Profile;

import java.time.LocalDate;

@Data
public class UtilisateurResponseDTO {
    private Long id;
    private String email;
    private String fullName;
    private String telephone;
    private String avatar;
    private Roles role;
    private LocalDate createAt;
    private LocalDate updateAt;
    private Profile profile;
}
