package org.kfokam48.stagemanagementbackend.mapper;

import org.kfokam48.stagemanagementbackend.dto.offreStage.CandidatureInOffreStageDTO;
import org.kfokam48.stagemanagementbackend.dto.offreStage.OffreStageDTO;
import org.kfokam48.stagemanagementbackend.dto.offreStage.OffreStageResponseDTO;
import org.kfokam48.stagemanagementbackend.exception.RessourceNotFoundException;
import org.kfokam48.stagemanagementbackend.model.OffreStage;
import org.kfokam48.stagemanagementbackend.repository.EntrepriseRepository;
import org.kfokam48.stagemanagementbackend.repository.SecteurRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class OffreStageMapper {
    private final ModelMapper modelMapper;
    private final EntrepriseRepository entrepriseRepository;
    private final SecteurRepository secteurRepository;

    public OffreStageMapper(ModelMapper modelMapper, EntrepriseRepository entrepriseRepository, SecteurRepository secteurRepository) {
        this.modelMapper = modelMapper;
        this.entrepriseRepository = entrepriseRepository;
        this.secteurRepository = secteurRepository;
    }

    public OffreStage offreStageDTOToOffreStage(OffreStageDTO offreStageDTO) {
       OffreStage offreStage = new OffreStage();
        offreStage.setDescription(offreStageDTO.getDescription());
        offreStage.setDureeStage(offreStageDTO.getDuree());
        offreStage.setSecteur(secteurRepository.findById(offreStageDTO.getSecteurId()).orElseThrow(()->new RessourceNotFoundException("Secteur not found")));
        offreStage.setCompetences(offreStageDTO.getCompetences());
       offreStage.setEntreprise(entrepriseRepository.findById(offreStageDTO.getEntrepriseId())
                .orElseThrow(() -> new RessourceNotFoundException("Entreprise not found")));
       offreStage.setIntitule(offreStageDTO.getIntitule());
       offreStage.setLocalisation(offreStageDTO.getLocalisation());
      offreStage.setDateDebutStage(offreStageDTO.getDateDebutStage());
       offreStage.setNombrePlaces(offreStageDTO.getNombrePlaces());
       offreStage.setDateLimiteCandidature(offreStageDTO.getDateLimiteCandidature());
        return offreStage;
    }

    public OffreStageResponseDTO offreStageToOffreStageResponseDTO(OffreStage offreStage) {
        OffreStageResponseDTO offreStageResponseDTO = new OffreStageResponseDTO();
        offreStageResponseDTO.setId(offreStage.getId());
        offreStageResponseDTO.setIntitule(offreStage.getIntitule());
        offreStageResponseDTO.setDescription(offreStage.getDescription());
        offreStageResponseDTO.setSecteurName(offreStage.getSecteur().getNomSecteur());
        offreStageResponseDTO.setCompetences(offreStage.getCompetences());
        offreStageResponseDTO.setLocalisation(offreStage.getLocalisation());
        offreStageResponseDTO.setDureeStage(offreStage.getDureeStage());
        offreStageResponseDTO.setNomEntreprise(offreStage.getEntreprise().getFullName());
        offreStageResponseDTO.setDatePublication(offreStage.getDatePublication());
        offreStageResponseDTO.setDateDebutStage(offreStage.getDateDebutStage());
        offreStageResponseDTO.setDateLimiteCandidature(offreStage.getDateLimiteCandidature());
        offreStageResponseDTO.setNombrePlaces(offreStage.getNombrePlaces());
        offreStageResponseDTO.setCandidatures(offreStage.getCandidatures().stream()
                .map(candidature -> modelMapper.map(candidature, CandidatureInOffreStageDTO.class))
                .toList());
        return offreStageResponseDTO;
    }

    public List<OffreStageResponseDTO> offresStageToOffresStageResponseDTOs(List<OffreStage> offresStage) {
        return offresStage.stream()
                .map(this::offreStageToOffreStageResponseDTO)
                .toList();
    }
}
