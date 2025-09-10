package org.kfokam48.stagemanagementbackend.service.impl;

import jakarta.transaction.Transactional;
import org.kfokam48.stagemanagementbackend.controlleur.notification.NotificationController;
import org.kfokam48.stagemanagementbackend.dto.convention.ConventionRequestDTO;
import org.kfokam48.stagemanagementbackend.dto.convention.ConventionResponseDTO;
import org.kfokam48.stagemanagementbackend.enums.StatutCandidature;
import org.kfokam48.stagemanagementbackend.enums.StatutConvention;
import org.kfokam48.stagemanagementbackend.exception.RessourceNotFoundException;
import org.kfokam48.stagemanagementbackend.mapper.CandidatureMapper;
import org.kfokam48.stagemanagementbackend.mapper.ConventionMapper;
import org.kfokam48.stagemanagementbackend.minio.MinIOService;
import org.kfokam48.stagemanagementbackend.service.pdf.PdfService;
import org.kfokam48.stagemanagementbackend.model.Administrateur;
import org.kfokam48.stagemanagementbackend.model.Candidature;
import org.kfokam48.stagemanagementbackend.model.ConventionStage;
import org.kfokam48.stagemanagementbackend.model.Enseignant;
import org.kfokam48.stagemanagementbackend.repository.AdministrateurRepository;
import org.kfokam48.stagemanagementbackend.repository.CandidatureRepository;
import org.kfokam48.stagemanagementbackend.repository.ConventionStageRepository;
import org.kfokam48.stagemanagementbackend.repository.EnseignantRepository;
import org.kfokam48.stagemanagementbackend.service.ConventionService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.time.LocalDate;
import java.util.List;
@Service
@Transactional
public class ConventionServiceImpl implements ConventionService {
    private final ConventionStageRepository conventionStageRepository;
    private final ConventionMapper conventionMapper;
    private final MinIOService minIOService;
    private final CandidatureMapper candidatureMapper;
    private final CandidatureRepository candidatureRepository;
    private final EnseignantRepository enseignantRepository;
    private final AdministrateurRepository administrateurRepository;
    private final NotificationController notificationController;
    private final PdfService pdfService;

    public ConventionServiceImpl(ConventionStageRepository conventionStageRepository, ConventionMapper conventionMapper, MinIOService minIOService, CandidatureMapper candidatureMapper, CandidatureRepository candidatureRepository, EnseignantRepository enseignantRepository, AdministrateurRepository administrateurRepository, NotificationController notificationController, PdfService pdfService) {
        this.conventionStageRepository = conventionStageRepository;
        this.conventionMapper = conventionMapper;
        this.minIOService = minIOService;
        this.candidatureMapper = candidatureMapper;
        this.candidatureRepository = candidatureRepository;
        this.enseignantRepository = enseignantRepository;
        this.notificationController = notificationController;
        this.administrateurRepository = administrateurRepository;
        this.pdfService = pdfService;
    }

    @Override
    public ConventionResponseDTO findByConventionId(Long conventionId) {
        ConventionStage conventionStage = conventionStageRepository.findById(conventionId).orElseThrow(()-> new RessourceNotFoundException("Convention not Found"));
        return conventionMapper.conventionStageToConventionResponseDTO(conventionStage);
    }

    @Override
    public ConventionResponseDTO createConvention(ConventionRequestDTO conventionRequestDTO) throws Exception {
        // Vérifier que la candidature existe
        Candidature candidature = candidatureRepository.findById(conventionRequestDTO.getIdCandidature())
                .orElseThrow(() -> new RessourceNotFoundException("Candidature introuvable avec l'ID: " + conventionRequestDTO.getIdCandidature()));
        
        // Vérifier que la candidature est acceptée
        if (!candidature.getStatut().equals(StatutCandidature.ACCEPTE)) {
            throw new IllegalStateException("Une convention ne peut être créée que pour une candidature acceptée. Statut actuel: " + candidature.getStatut());
        }
        
        // Vérifier qu'une convention n'existe pas déjà pour cette candidature
        if (conventionStageRepository.existsByCandidatureId(conventionRequestDTO.getIdCandidature())) {
            throw new IllegalStateException("Une convention existe déjà pour cette candidature");
        }
        
        ConventionStage conventionStage = conventionMapper.conventionRequestDTOToCoventionStage(conventionRequestDTO);
        conventionStage.setStatutConvention(StatutConvention.EN_ATTENTE);
        conventionStage.setDateDebut(LocalDate.now());
        conventionStage.setDateCreation(LocalDate.now());
        
        try {
            int duree = conventionStage.getCandidature().getOffreStage().getDureeStage();
            conventionStage.setDateFin(LocalDate.now().plusMonths(duree));
        } catch (Exception e) {
            throw new RuntimeException("Échec du calcul de la date de fin: " + e.getMessage());
        }
        
        conventionStageRepository.save(conventionStage);
        notificationController.sendNotification(1L,"Convention created", "Nouvelle convention creer",false);
        return conventionMapper.conventionStageToConventionResponseDTO(conventionStage);
    }
    @Override
    public ConventionResponseDTO updateConvention(Long conventionId, Long idCandidature) throws Exception {
        ConventionStage conventionStage = conventionStageRepository.findById(conventionId)
                .orElseThrow(() -> new RessourceNotFoundException("Convention introuvable avec l'ID: " + conventionId));
        
        // Vérifier que la convention peut être modifiée
        if (conventionStage.getStatutConvention() == StatutConvention.VALIDE || 
            conventionStage.getStatutConvention() == StatutConvention.APPROUVE) {
            throw new IllegalStateException("Impossible de modifier une convention validée ou approuvée. Statut actuel: " + conventionStage.getStatutConvention());
        }
        
        if (idCandidature != null) {
            Candidature candidature = candidatureRepository.findById(idCandidature)
                    .orElseThrow(() -> new RessourceNotFoundException("Candidature introuvable avec l'ID: " + idCandidature));
            conventionStage.setCandidature(candidature);
        }
        
        conventionStage.setDateDebut(LocalDate.now());
        conventionStage.setDateCreation(LocalDate.now());
        
        try {
            int duree = conventionStage.getCandidature().getOffreStage().getDureeStage();
            conventionStage.setDateFin(LocalDate.now().plusMonths(duree));
        } catch (Exception e) {
            throw new RuntimeException("Échec du calcul de la date de fin: " + e.getMessage());
        }
        
        conventionStage.setStatutConvention(StatutConvention.EN_ATTENTE);
        
        conventionStageRepository.save(conventionStage);
        
        // Envoyer notification aux enseignants de la même filière
        String filiereEtudiant = conventionStage.getCandidature().getEtudiant().getFiliere();
        List<Enseignant> enseignants = enseignantRepository.findByFiliere(filiereEtudiant);
        
        for (Enseignant enseignant : enseignants) {
            try {
                notificationController.sendNotification(
                    enseignant.getId(), 
                    "Nouvelle convention à valider", 
                    "Une nouvelle convention de stage a été créée pour l'étudiant " + 
                    conventionStage.getCandidature().getEtudiant().getFullName() + 
                    " (" + filiereEtudiant + "). Veuillez la valider.", 
                    false
                );
            } catch (Exception e) {
                // Log l'erreur mais ne pas faire échouer la création
            }
        }
        
        return conventionMapper.conventionStageToConventionResponseDTO(conventionStage);
    }

    @Override
    public String deleteConvention(Long conventionId) {
        ConventionStage conventionStage = conventionStageRepository.findById(conventionId)
                .orElseThrow(() -> new RessourceNotFoundException("Convention introuvable avec l'ID: " + conventionId));
        
        // Vérifier que la convention peut être supprimée
        if (conventionStage.getStatutConvention() == StatutConvention.VALIDE || 
            conventionStage.getStatutConvention() == StatutConvention.APPROUVE) {
            throw new IllegalStateException("Impossible de supprimer une convention validée ou approuvée. Statut actuel: " + conventionStage.getStatutConvention());
        }
        
        conventionStageRepository.delete(conventionStage);
        return "Convention supprimée avec succès";
    }

    @Override
    public List<ConventionResponseDTO> findAllConventions() {
        return conventionMapper.conventionStageToConventionResponseDTOList(conventionStageRepository.findAll());
    }

    @Override
    public List<ConventionResponseDTO> findConventionsByEntreprise(Long entrepriseId) {
        List<ConventionStage> conventions = conventionStageRepository.findByCandidatureOffreStageEntrepriseId(entrepriseId);
        return conventionMapper.conventionStageToConventionResponseDTOList(conventions);
    }

    @Override
    public List<ConventionResponseDTO> findConventionsByEnseignant(Long enseignantId) {
        Enseignant enseignant = enseignantRepository.findById(enseignantId)
                .orElseThrow(() -> new RessourceNotFoundException("Enseignant introuvable avec l'ID: " + enseignantId));
        
        List<ConventionStage> conventions = conventionStageRepository.findByCandidatureEtudiantFiliere(enseignant.getFiliere());
        return conventionMapper.conventionStageToConventionResponseDTOList(conventions);
    }

    @Override
    public ConventionResponseDTO validateConventionByEnseignant(Long enseigantId, Long conventionId) throws IOException {
        Enseignant enseignant = enseignantRepository.findById(enseigantId).orElseThrow(()-> new RessourceNotFoundException("Enseignant not Found"));
        ConventionStage conventionStage = conventionStageRepository.findById(conventionId).orElseThrow(()-> new RessourceNotFoundException("Convention not Found"));
        conventionStage.setDateValidation(LocalDate.now());
        conventionStage.setStatutConvention(StatutConvention.VALIDE);
        conventionStage.setEnseignantValideur(enseignant);
        conventionStageRepository.save(conventionStage);
        Long entrepriseID = conventionStage.getCandidature().getOffreStage().getEntreprise().getId();
        notificationController.sendNotification(entrepriseID, "Convention Validated", "Votre convention du : "+conventionStage.getDateCreation()+" a été validé ",false);
        notificationController.sendNotification(1L, "Convention Validated", "La convention N): "+conventionStage.getId()+" a été validé votre aprobation est attendu ", false);
        return conventionMapper.conventionStageToConventionResponseDTO(conventionStage);
    }

    @Override
    public ConventionResponseDTO approuveConventionByAdministrator(Long administratorId, Long conventionId) throws IOException {
        Administrateur administrateur = administrateurRepository.findById(administratorId).orElseThrow(()-> new RessourceNotFoundException("Administrateur not Found"));
        ConventionStage conventionStage = conventionStageRepository.findById(conventionId).orElseThrow(()-> new RessourceNotFoundException("Convention not Found"));
        conventionStage.setDateAprouval(LocalDate.now());
        conventionStage.setStatutConvention(StatutConvention.APPROUVE);
        conventionStage.setAprouvalAdministrator(administrateur);
        conventionStageRepository.save(conventionStage);
        Long entrepriseID = conventionStage.getCandidature().getOffreStage().getEntreprise().getId();
        Long etudiantId = conventionStage.getCandidature().getEtudiant().getId();
        notificationController.sendNotification(entrepriseID, "Convention Aprouved","Votre convention du : "+conventionStage.getDateCreation()+" a été approuvé ",false);
        notificationController.sendNotification(etudiantId, "Convention Aprouved", "Convention de stage deja disponible) ", false);
        return conventionMapper.conventionStageToConventionResponseDTO(conventionStage);
    }
    @Override
    public ResponseEntity<byte[]> generateConventionPdf(Long conventionId) throws Exception {
        ConventionStage conventionStage = conventionStageRepository.findById(conventionId)
                .orElseThrow(() -> new RessourceNotFoundException("Convention introuvable avec l'ID: " + conventionId));

        ByteArrayOutputStream pdfStream = pdfService.generateConventionPdf(conventionStage);
        byte[] pdfBytes = pdfStream.toByteArray();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "convention_" + conventionId + ".pdf");

        return ResponseEntity.ok().headers(headers).body(pdfBytes);
    }


}
