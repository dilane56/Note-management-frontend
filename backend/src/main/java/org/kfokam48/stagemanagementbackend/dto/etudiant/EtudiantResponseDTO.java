package org.kfokam48.stagemanagementbackend.dto.etudiant;

import lombok.Data;
import org.kfokam48.stagemanagementbackend.dto.utilisateur.UtilisateurResponseDTO;

@Data
public class EtudiantResponseDTO extends UtilisateurResponseDTO {
    private String filiere;
    private String anneeScolaire;
    private String niveau;
    private String universite;
}
