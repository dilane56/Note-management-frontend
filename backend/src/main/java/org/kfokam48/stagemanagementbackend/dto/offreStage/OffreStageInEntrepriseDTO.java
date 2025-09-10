package org.kfokam48.stagemanagementbackend.dto.offreStage;

import lombok.Data;

@Data
public class OffreStageInEntrepriseDTO {
    private Long idOffreStage;
    private String intitule;
    private String domaine;
    private String duree; // en mois
}
