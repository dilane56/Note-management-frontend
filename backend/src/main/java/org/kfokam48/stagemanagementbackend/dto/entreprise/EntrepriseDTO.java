package org.kfokam48.stagemanagementbackend.dto.entreprise;

import lombok.Data;
import org.kfokam48.stagemanagementbackend.dto.utilisateur.UtilisateurDTO;

import java.time.LocalDate;

@Data
public class EntrepriseDTO extends UtilisateurDTO {
    private String domaineActivite;
    private String siteWeb;
    private String description;
    private LocalDate dateCreation;
}
