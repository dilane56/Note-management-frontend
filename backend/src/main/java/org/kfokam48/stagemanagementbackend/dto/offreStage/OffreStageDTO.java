package org.kfokam48.stagemanagementbackend.dto.offreStage;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OffreStageDTO {
    @NotNull(message = "L'intitulé de l'offre de stage est obligatoire")
    @NotBlank(message = "L'intitulé de l'offre de stage ne peut pas être vide")
    private String intitule;
    private String description;
    @NotNull(message = "La durée de l'offre de stage est obligatoire")
    private int duree; // en mois
    @NotNull(message = "L'entreprise qui publie l'offre est obligatoire")
    private Long entrepriseId; // L'entreprise qui publie l'offre
    private String localisation;
    private Long secteurId;
    private List<String> competences;
    private LocalDate dateDebutStage;
    private LocalDateTime dateLimiteCandidature;
    private int nombrePlaces;

}
