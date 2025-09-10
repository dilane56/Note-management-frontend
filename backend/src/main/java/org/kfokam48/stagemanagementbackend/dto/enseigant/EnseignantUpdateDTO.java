package org.kfokam48.stagemanagementbackend.dto.enseigant;

import lombok.Data;
import org.kfokam48.stagemanagementbackend.dto.utilisateur.UtilisateurDTO;

@Data
public class EnseignantUpdateDTO extends UtilisateurDTO {
    private String filiere;
    private String grade;
    private String departement;
    private String universite;
}
