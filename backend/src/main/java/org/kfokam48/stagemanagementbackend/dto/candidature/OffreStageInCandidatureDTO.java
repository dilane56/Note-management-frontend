package org.kfokam48.stagemanagementbackend.dto.candidature;

import lombok.Data;

@Data
public class OffreStageInCandidatureDTO {
    private Long id;
    private String intitule;
    private String secteur;
    private int dureeStage; // en mois
    private String nomEntreprise; // L'entreprise qui publie l'offre
    private String localisation;
}
