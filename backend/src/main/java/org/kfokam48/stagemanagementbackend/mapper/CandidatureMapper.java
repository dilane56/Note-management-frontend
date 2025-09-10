package org.kfokam48.stagemanagementbackend.mapper;

import org.kfokam48.stagemanagementbackend.dto.candidature.CandidatureDTO;
import org.kfokam48.stagemanagementbackend.dto.candidature.CandidatureResponseDTO;
import org.kfokam48.stagemanagementbackend.dto.candidature.OffreStageInCandidatureDTO;
import org.kfokam48.stagemanagementbackend.exception.RessourceNotFoundException;
import org.kfokam48.stagemanagementbackend.model.Candidature;
import org.kfokam48.stagemanagementbackend.repository.EtudiantRepository;
import org.kfokam48.stagemanagementbackend.repository.OffreStageRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class CandidatureMapper {
    private final ModelMapper modelMapper;
    private final OffreStageRepository offreStageRepository;
    private final EtudiantRepository etudiantRepository;

    public CandidatureMapper(ModelMapper modelMapper, OffreStageRepository offreStageRepository, EtudiantRepository etudiantRepository) {
        this.modelMapper = modelMapper;
        this.offreStageRepository = offreStageRepository;
        this.etudiantRepository = etudiantRepository;
    }

    public Candidature candidatureDTOToCandidature(CandidatureDTO candidatureDTO){
        Candidature candidature = new Candidature();
        candidature.setDateCandidature(LocalDate.now());
        candidature.setEtudiant(etudiantRepository.findById(candidatureDTO.getEtudiantId())
                .orElseThrow(() -> new RessourceNotFoundException("Etudiant not found")));
        candidature.setOffreStage(offreStageRepository.findById(candidatureDTO.getOffreStageId())
                .orElseThrow(() -> new RessourceNotFoundException("Offre de stage not found")));
        candidature.setLettreMotivation(candidatureDTO.getLettreMotivation());
        return candidature;
    }
    public CandidatureResponseDTO candidatureToCandidatureResponseDTO(Candidature candidature){
        CandidatureResponseDTO candidatureResponseDTO = new CandidatureResponseDTO();
        candidatureResponseDTO.setId(candidature.getId());
        candidatureResponseDTO.setStatutCandidature(candidature.getStatut());
        candidatureResponseDTO.setLettreMotivation(candidature.getLettreMotivation());
        candidatureResponseDTO.setDateCandidature(candidature.getDateCandidature());
        candidatureResponseDTO.setEtudiantUsername(candidature.getEtudiant().getFullName());
        candidatureResponseDTO.setDateReponse(candidature.getDateReponse());
        candidatureResponseDTO.setMessageReponse(candidature.getMessageReponse());
        candidatureResponseDTO.setOffreStage(offreStageToOffreStageInCandidatureDTO(candidature));
        candidatureResponseDTO.setCheminFichier(candidature.getCvPath());
        candidatureResponseDTO.setEtudiantId(candidature.getEtudiant().getId());
        return candidatureResponseDTO;

    }

    public List<CandidatureResponseDTO> candidatureToCandidatureResponseDTO(List<Candidature> candidatures){
        return  candidatures.stream()
                .map(this::candidatureToCandidatureResponseDTO)
                .toList();
    }

    public OffreStageInCandidatureDTO offreStageToOffreStageInCandidatureDTO(Candidature candidature){
        OffreStageInCandidatureDTO offreStageInCandidatureDTO = new OffreStageInCandidatureDTO();
        offreStageInCandidatureDTO.setId(candidature.getOffreStage().getId());
        offreStageInCandidatureDTO.setIntitule(candidature.getOffreStage().getIntitule());
        offreStageInCandidatureDTO.setDureeStage(candidature.getOffreStage().getDureeStage());
        offreStageInCandidatureDTO.setNomEntreprise(candidature.getOffreStage().getEntreprise().getFullName());
        offreStageInCandidatureDTO.setSecteur(candidature.getOffreStage().getSecteur().getNomSecteur());
        offreStageInCandidatureDTO.setLocalisation(candidature.getOffreStage().getLocalisation());
        return offreStageInCandidatureDTO;
    }
}
