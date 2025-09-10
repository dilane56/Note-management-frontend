package org.kfokam48.stagemanagementbackend.dto.offreStage;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OffreStageResponseDTO {
   private Long id;
    private String intitule;
    private String description;
    private int dureeStage;
    private String nomEntreprise;
    private String localisation;
    private List<CandidatureInOffreStageDTO> candidatures;
    private List<String> competences;
    private String secteurName;
    private LocalDate datePublication;
    private LocalDateTime dateLimiteCandidature;
    private LocalDate dateDebutStage;
    private int nombrePlaces;



}
