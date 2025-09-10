package org.kfokam48.stagemanagementbackend.service;

import org.kfokam48.stagemanagementbackend.dto.offreStage.OffreStageDTO;
import org.kfokam48.stagemanagementbackend.dto.offreStage.OffreStageResponseDTO;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface OffreStageService {
    public OffreStageResponseDTO getOffreStageById(Long id);
    public ResponseEntity<String> deleteOffreStageById(Long id);
    public OffreStageResponseDTO createOffreStage(OffreStageDTO offreStageDTO);
    List<OffreStageResponseDTO> filterOffresStage(String localisation, Integer duree, String secteurNom);
    public OffreStageResponseDTO updateOffreStage(Long id, OffreStageDTO offreStageDTO);
    public List<OffreStageResponseDTO> getAllOffresStage();
    public List<OffreStageResponseDTO> getOffresByEntreprise(Long entrepriseId);
    public OffreStageResponseDTO addCompetence(String competence,Long id);

}
