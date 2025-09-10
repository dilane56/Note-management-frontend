package org.kfokam48.stagemanagementbackend.dto.entreprise;

import lombok.Data;
import org.kfokam48.stagemanagementbackend.dto.offreStage.OffreStageInEntrepriseDTO;
import org.kfokam48.stagemanagementbackend.dto.utilisateur.UtilisateurResponseDTO;

import java.time.LocalDate;
import java.util.List;

@Data
public class EntrepriseReponseDTO extends UtilisateurResponseDTO {
    private String domaineActivite;
    private String siteWeb;
    private String description;
    private LocalDate dateCreation;
    private List<OffreStageInEntrepriseDTO> offres;
}
