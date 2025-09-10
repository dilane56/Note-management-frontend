package org.kfokam48.stagemanagementbackend.service.impl;

import org.kfokam48.stagemanagementbackend.controlleur.notification.NotificationController;
import org.kfokam48.stagemanagementbackend.dto.offreStage.OffreStageDTO;
import org.kfokam48.stagemanagementbackend.dto.offreStage.OffreStageResponseDTO;
import org.kfokam48.stagemanagementbackend.exception.RessourceNotFoundException;
import org.kfokam48.stagemanagementbackend.mapper.OffreStageMapper;
import org.kfokam48.stagemanagementbackend.model.OffreStage;
import org.kfokam48.stagemanagementbackend.repository.EntrepriseRepository;
import org.kfokam48.stagemanagementbackend.repository.OffreStageRepository;
import org.kfokam48.stagemanagementbackend.repository.SecteurRepository;
import org.kfokam48.stagemanagementbackend.service.OffreStageService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
@Service
@Transactional
public class OffreStageServiceImpl implements OffreStageService {
    private final OffreStageRepository offreStageRepository;
    private final OffreStageMapper offreStageMapper;
    private final EntrepriseRepository entrepriseRepository;
    private final SecteurRepository secteurRepository;
    private final NotificationController notificationController;

    public OffreStageServiceImpl(OffreStageRepository offreStageRepository, OffreStageMapper offreStageMapper, EntrepriseRepository entrepriseRepository, SecteurRepository secteurRepository, NotificationController notificationController) {
        this.offreStageRepository = offreStageRepository;
        this.offreStageMapper = offreStageMapper;
        this.entrepriseRepository = entrepriseRepository;
        this.secteurRepository = secteurRepository;
        this.notificationController = notificationController;
    }

    @Override
    public OffreStageResponseDTO getOffreStageById(Long id) {
        OffreStage offreStage = offreStageRepository.findById(id)
                .orElseThrow(() -> new RessourceNotFoundException("Offre de stage not found"));

        return offreStageMapper.offreStageToOffreStageResponseDTO(offreStage);
    }

    @Override
    public ResponseEntity<String> deleteOffreStageById(Long id) {
        OffreStage offreStage = offreStageRepository.findById(id)
                .orElseThrow(() -> new RessourceNotFoundException("Offre de stage not found"));
        offreStageRepository.deleteById(id);
        return ResponseEntity.ok("Offre de stage deleted successfully");
    }

    @Override
    public OffreStageResponseDTO createOffreStage(OffreStageDTO offreStageDTO) {
        OffreStage offreStage = offreStageMapper.offreStageDTOToOffreStage(offreStageDTO);
        offreStage.setDatePublication(LocalDate.now());
        offreStageRepository.save(offreStage);
        Long adminId = 1L;
        notificationController.sendNotification(adminId, "Nouvelle offre de stage", "une nouvelle offre de stage a ete ajouter",false);
        return offreStageMapper.offreStageToOffreStageResponseDTO(offreStage);
    }

    @Override
    public List<OffreStageResponseDTO> filterOffresStage(String localisation, Integer duree, String secteurNom) {
        List<OffreStage> offres;
        
        if (localisation != null && duree != null && secteurNom != null) {
            offres = offreStageRepository.findByLocalisationContainingIgnoreCaseAndDureeStageAndSecteurNomSecteurContainingIgnoreCase(localisation, duree, secteurNom);
        } else if (localisation != null && duree != null) {
            offres = offreStageRepository.findByLocalisationContainingIgnoreCaseAndDureeStage(localisation, duree);
        } else if (localisation != null && secteurNom != null) {
            offres = offreStageRepository.findByLocalisationContainingIgnoreCaseAndSecteurNomSecteurContainingIgnoreCase(localisation, secteurNom);
        } else if (duree != null && secteurNom != null) {
            offres = offreStageRepository.findByDureeStageAndSecteurNomSecteurContainingIgnoreCase(duree, secteurNom);
        } else if (localisation != null) {
            offres = offreStageRepository.findByLocalisationContainingIgnoreCase(localisation);
        } else if (duree != null) {
            offres = offreStageRepository.findByDureeStage(duree);
        } else if (secteurNom != null) {
            offres = offreStageRepository.findBySecteurNomSecteurContainingIgnoreCase(secteurNom);
        } else {
            offres = offreStageRepository.findAll();
        }

        return offreStageMapper.offresStageToOffresStageResponseDTOs(offres);
    }


    @Override
    public OffreStageResponseDTO updateOffreStage(Long id, OffreStageDTO offreStageDTO) {
        OffreStage offreStage = offreStageRepository.findById(id)
                .orElseThrow(() -> new RessourceNotFoundException("Offre de stage not found"));
        if (!entrepriseRepository.existsById(offreStageDTO.getEntrepriseId())) {
            throw new RessourceNotFoundException("Entreprise not found");
        }
        offreStage.setIntitule(offreStageDTO.getIntitule());
        offreStage.setDescription(offreStageDTO.getDescription());
        offreStage.setSecteur(secteurRepository.findById(offreStageDTO.getSecteurId()).orElseThrow(()-> new RessourceNotFoundException("Secteur not Found")));
        offreStage.setCompetences(offreStageDTO.getCompetences());
        offreStage.setLocalisation(offreStageDTO.getLocalisation());
        offreStage.setDureeStage(offreStageDTO.getDuree());
        offreStage.setDatePublication(LocalDate.now());
        offreStage.setDateDebutStage(offreStageDTO.getDateDebutStage());
        offreStage.setNombrePlaces(offreStageDTO.getNombrePlaces());
        offreStage.setDateLimiteCandidature(offreStageDTO.getDateLimiteCandidature());
        offreStage.setEntreprise(entrepriseRepository.findById(offreStageDTO.getEntrepriseId())
                .orElseThrow(() -> new RessourceNotFoundException("Entreprise not found")));
        offreStageRepository.save(offreStage);
        return offreStageMapper.offreStageToOffreStageResponseDTO(offreStage);
    }

    @Override
    public List<OffreStageResponseDTO> getAllOffresStage() {
        return offreStageMapper.offresStageToOffresStageResponseDTOs(offreStageRepository.findAll());
    }

    @Override
    public List<OffreStageResponseDTO> getOffresByEntreprise(Long entrepriseId) {
        List<OffreStage> offres = offreStageRepository.findByEntrepriseId(entrepriseId);
        return offreStageMapper.offresStageToOffresStageResponseDTOs(offres);
    }

    @Override
    public OffreStageResponseDTO addCompetence(String competence, Long id) {
        OffreStage offreStage = offreStageRepository.findById(id)
                .orElseThrow(() -> new RessourceNotFoundException("Offre de stage not found"));
        offreStage.getCompetences().add(competence);
        offreStageRepository.save(offreStage);
        return offreStageMapper.offreStageToOffreStageResponseDTO(offreStage);

    }
}
