package org.kfokam48.stagemanagementbackend.dto.etudiant;

import lombok.Data;
import org.kfokam48.stagemanagementbackend.dto.utilisateur.UtilisateurDTO;

@Data
public class EtudiantUpdateDTO extends UtilisateurDTO {
    private String filiere;
    private String anneeScolaire;
    private String niveau;
    private String universite;
}
