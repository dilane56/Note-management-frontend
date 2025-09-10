package org.kfokam48.stagemanagementbackend.dto.reports;

import lombok.Data;

@Data
public class StagesByFiliereDTO {
    private String filiere;
    private Long totalStages;
    private Long stagesEnCours;
    private Long stagesTermines;
    private Long stagesEnAttente;
}