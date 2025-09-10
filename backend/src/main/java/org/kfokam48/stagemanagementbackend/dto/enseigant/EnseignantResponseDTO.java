package org.kfokam48.stagemanagementbackend.dto.enseigant;

import lombok.Data;
import org.kfokam48.stagemanagementbackend.dto.utilisateur.UtilisateurResponseDTO;

@Data
public class EnseignantResponseDTO extends UtilisateurResponseDTO {
    private String filiere;
    private String grade;
    private String departement;
    private String universite;
}
