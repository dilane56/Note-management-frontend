package org.kfokam48.stagemanagementbackend.dto.candidature;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CandidatureDTO {
    @NotNull(message = "l'id de l'etudiant ne doit pas être null")
    private Long etudiantId;
    @NotNull(message = "l'id de l'offre de stage ne doit pas etre null")
    private Long offreStageId;
    @NotNull(message = "la date de la candidature ne doit pas être null")
    private String lettreMotivation;


}
