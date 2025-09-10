package org.kfokam48.stagemanagementbackend.service.impl;

import jakarta.transaction.Transactional;
import org.kfokam48.stagemanagementbackend.controlleur.notification.NotificationController;
import org.kfokam48.stagemanagementbackend.dto.candidature.CandidatureDTO;
import org.kfokam48.stagemanagementbackend.dto.candidature.CandidatureResponseDTO;
import org.kfokam48.stagemanagementbackend.enums.StatutCandidature;
import org.kfokam48.stagemanagementbackend.exception.ResourceAlreadyExistException;
import org.kfokam48.stagemanagementbackend.exception.RessourceNotFoundException;
import org.kfokam48.stagemanagementbackend.mapper.CandidatureMapper;
import org.kfokam48.stagemanagementbackend.minio.MinIOService;
import org.kfokam48.stagemanagementbackend.model.Candidature;
import org.kfokam48.stagemanagementbackend.repository.CandidatureRepository;
import org.kfokam48.stagemanagementbackend.repository.EtudiantRepository;
import org.kfokam48.stagemanagementbackend.repository.OffreStageRepository;
import org.kfokam48.stagemanagementbackend.service.CandidatureService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class CandidatureServiceImpl implements CandidatureService {
    private final CandidatureRepository candidatureRepository;
    private final CandidatureMapper candidatureMapper;
    private final OffreStageRepository offreStageRepository;
    private final EtudiantRepository etudiantRepository;
    private final MinIOService minIOService;
    private final NotificationController notificationController;


    public CandidatureServiceImpl(CandidatureRepository candidatureRepository, CandidatureMapper candidatureMapper, OffreStageRepository offreStageRepository, EtudiantRepository etudiantRepository, MinIOService minIOService, NotificationController notificationController) {
        this.candidatureRepository = candidatureRepository;
        this.candidatureMapper = candidatureMapper;
        this.offreStageRepository = offreStageRepository;
        this.etudiantRepository = etudiantRepository;
        this.notificationController = notificationController;
        this.minIOService = minIOService;
    }

    @Override
    public CandidatureResponseDTO getCandidatureById(Long id) {
       Candidature candidature = candidatureRepository.findById(id)
               .orElseThrow(() -> new RessourceNotFoundException("Candidature not found"));
       return candidatureMapper.candidatureToCandidatureResponseDTO(candidature);
    }

    @Override
    public List<CandidatureResponseDTO> getAllCandidatures() {
        return candidatureMapper.candidatureToCandidatureResponseDTO(candidatureRepository.findAll());
    }

    @Override
    public List<CandidatureResponseDTO> getCandidaturesByEtudiant(Long etudiantId) {
        List<Candidature> candidatures = candidatureRepository.findByEtudiantId(etudiantId);
        return candidatureMapper.candidatureToCandidatureResponseDTO(candidatures);
    }

    @Override
    public List<CandidatureResponseDTO> getCandidaturesByEntreprise(Long entrepriseId) {
        List<Candidature> candidatures = candidatureRepository.findByOffreStageEntrepriseId(entrepriseId);
        return candidatureMapper.candidatureToCandidatureResponseDTO(candidatures);
    }

    @Override
    public CandidatureResponseDTO updateCandidature(Long id, Long idEtudiant, Long idOffre, String lettreMotivation, MultipartFile file) throws Exception {
        Candidature candidature = candidatureRepository.findById(id)
                .orElseThrow(() -> new RessourceNotFoundException("Candidature not found"));
        
        candidature.setEtudiant(etudiantRepository.findById(idEtudiant)
                .orElseThrow(() -> new RessourceNotFoundException("Etudiant not found")));
        candidature.setOffreStage(offreStageRepository.findById(idOffre)
                .orElseThrow(() -> new RessourceNotFoundException("Offre stage not found")));
        candidature.setLettreMotivation(lettreMotivation);
        candidature.setDateCandidature(LocalDate.now());
        
        if (file != null && !file.isEmpty()) {
            String fileUrl = minIOService.uploadFile(file);
            candidature.setCvPath(fileUrl);
        }
        
        candidatureRepository.save(candidature);
        Long entrepriseId = candidature.getOffreStage().getEntreprise().getId();
        notificationController.sendNotification(entrepriseId, "Candidature mise à jour", "Une candidature a été mise à jour", false);
        return candidatureMapper.candidatureToCandidatureResponseDTO(candidature);
    }


    @Override
    public CandidatureResponseDTO addCandidature(CandidatureDTO candidatureDTO, MultipartFile file) throws Exception {
        // ✅ Vérification en base de données
        boolean exists = candidatureRepository.existsByEtudiantIdAndOffreStageId(
                candidatureDTO.getEtudiantId(), candidatureDTO.getOffreStageId());

        if (exists) {
            throw new ResourceAlreadyExistException("L'étudiant a déjà postulé à cette offre !");
        }


        // ✅ Mapper l'objet DTO en entité
        Candidature candidature = candidatureMapper.candidatureDTOToCandidature(candidatureDTO);

        candidature.setDateCandidature(LocalDate.now());
        candidature.setStatut(StatutCandidature.EN_ATTENTE);
        // ✅ Lettre de motivation
        candidature.setLettreMotivation(candidatureDTO.getLettreMotivation());

        // ✅ 1. Uploader le fichier CV dans MinIO
        String fileUrl = minIOService.uploadFile(file); // 🚀 Envoi du fichier

        // ✅ 2. Ajouter l’URL du CV à la candidature
        candidature.setCvPath(fileUrl);

        // ✅ 3. Enregistrer la candidature avec l’URL du CV
        candidatureRepository.save(candidature);
        Long entrepriseId = candidature.getOffreStage().getEntreprise().getId();
        notificationController.sendNotification(entrepriseId, "Nouvelle candidature", "Une nouvelle candidature a été postulée à votre offre", false);

        return candidatureMapper.candidatureToCandidatureResponseDTO(candidature);
    }

    @Override
    public ResponseEntity<String> updateCandidatureStatut(Long id, String statut, String message) throws IOException {
        Candidature candidature = candidatureRepository.findById(id)
                .orElseThrow(() -> new RessourceNotFoundException("Candidature not found"));

        candidature.setStatut(StatutCandidature.valueOf(statut));
        candidature.setDateReponse(LocalDate.now());
        candidature.setMessageReponse(message);
        candidatureRepository.save(candidature);

        // Envoi d'une notification en temps réel via WebSocket
        notificationController.sendNotification(candidature.getEtudiant().getId(), "Statut de la candidature", "Votre candidature a été " + statut, false);


        return ResponseEntity.ok("Statut de la candidature mis à jour avec succès");
    }







    @Override
    public ResponseEntity<String> deleteCandidature(Long id) {
        Candidature candidature = candidatureRepository.findById(id)
                .orElseThrow(() -> new RessourceNotFoundException("Candidature not found"));
        candidatureRepository.deleteById(id);
        return ResponseEntity.ok("Deleted Candidature");
    }

    @Override
    public  ResponseEntity<String> uploadImage(MultipartFile file, Long id) throws Exception {
        Candidature candidature = candidatureRepository.findById(id).orElseThrow(() -> new RessourceNotFoundException("Candidature not found"));
        // Définir le chemin du fichier

        String fileUrl = minIOService.uploadFile(file);
        candidature.setCvPath(fileUrl);
        candidature.setCvPath(fileUrl);
        candidatureRepository.save(candidature);
        return ResponseEntity.ok("CV uploaded");

    }
}
