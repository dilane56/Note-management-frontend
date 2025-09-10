package org.kfokam48.stagemanagementbackend.dto.offreStage;

import lombok.Data;
import org.kfokam48.stagemanagementbackend.enums.StatutCandidature;

import java.time.LocalDate;

@Data
public class CandidatureInOffreStageDTO {
    private Long idCandidature;
    private String etudiantUsername; // UtilisateurResponseDTO
    private LocalDate dateCandidature;
    private StatutCandidature statutCandidature;

}
