package org.kfokam48.stagemanagementbackend.dto.candidature;

import lombok.Data;
import org.kfokam48.stagemanagementbackend.enums.StatutCandidature;

import java.time.LocalDate;

@Data
public class CandidatureResponseDTO {
    private Long id;
    private String etudiantUsername; // UtilisateurResponseDTO
    private OffreStageInCandidatureDTO offreStage; // OffreStageInCandidatureDTO
    private LocalDate dateCandidature;
    private StatutCandidature statutCandidature;
    private String lettreMotivation;
    private String cheminFichier;
    private LocalDate dateReponse;
    private String messageReponse;
    private Long etudiantId;

    // Add any other fields you need for the response
}
