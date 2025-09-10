package org.kfokam48.stagemanagementbackend.service.impl;

import org.kfokam48.stagemanagementbackend.dto.stats.*;
import org.kfokam48.stagemanagementbackend.enums.StatutCandidature;
import org.kfokam48.stagemanagementbackend.enums.StatutConvention;
import org.kfokam48.stagemanagementbackend.repository.*;
import org.kfokam48.stagemanagementbackend.service.StatsService;
import org.springframework.stereotype.Service;

@Service
public class StatsServiceImpl implements StatsService {
    
    private final OffreStageRepository offreStageRepository;
    private final CandidatureRepository candidatureRepository;
    private final ConventionStageRepository conventionRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final EntrepriseRepository entrepriseRepository;

    public StatsServiceImpl(OffreStageRepository offreStageRepository, CandidatureRepository candidatureRepository, 
                           ConventionStageRepository conventionRepository, UtilisateurRepository utilisateurRepository,
                           EntrepriseRepository entrepriseRepository) {
        this.offreStageRepository = offreStageRepository;
        this.candidatureRepository = candidatureRepository;
        this.conventionRepository = conventionRepository;
        this.utilisateurRepository = utilisateurRepository;
        this.entrepriseRepository = entrepriseRepository;
    }

    @Override
    public EtudiantStatsDTO getEtudiantStats(Long etudiantId) {
        EtudiantStatsDTO stats = new EtudiantStatsDTO();
        stats.setAvailableInternships(offreStageRepository.count());
        stats.setMyApplications(candidatureRepository.countByEtudiantId(etudiantId));
        stats.setAcceptedApplications(candidatureRepository.countByEtudiantIdAndStatut(etudiantId, StatutCandidature.ACCEPTE));
        stats.setPendingApplications(candidatureRepository.countByEtudiantIdAndStatut(etudiantId, StatutCandidature.EN_ATTENTE));
        return stats;
    }

    @Override
    public EntrepriseStatsDTO getEntrepriseStats(Long entrepriseId) {
        EntrepriseStatsDTO stats = new EntrepriseStatsDTO();
        stats.setPublishedOffers(offreStageRepository.countByEntrepriseId(entrepriseId));
        stats.setReceivedApplications(candidatureRepository.countByOffreStageEntrepriseId(entrepriseId));
        stats.setAcceptedApplications(candidatureRepository.countByOffreStageEntrepriseIdAndStatut(entrepriseId, StatutCandidature.ACCEPTE));
        stats.setPendingApplications(candidatureRepository.countByOffreStageEntrepriseIdAndStatut(entrepriseId, StatutCandidature.EN_ATTENTE));
        return stats;
    }

    @Override
    public EnseignantStatsDTO getEnseignantStats(Long enseignantId) {
        EnseignantStatsDTO stats = new EnseignantStatsDTO();
        stats.setTotalConventions(conventionRepository.countByEnseignantValideurId(enseignantId));
        stats.setPendingConventions(conventionRepository.countByEnseignantValideurIdAndStatutConvention(enseignantId, StatutConvention.EN_ATTENTE));
        stats.setStudentsFollowed(conventionRepository.countDistinctStudentsByEnseignantId(enseignantId));
        stats.setCompletedInternships(conventionRepository.countByEnseignantValideurIdAndStatutConvention(enseignantId, StatutConvention.APPROUVE));
        return stats;
    }

    @Override
    public AdminStatsDTO getAdminStats() {
        AdminStatsDTO stats = new AdminStatsDTO();
        stats.setTotalUsers(utilisateurRepository.count());
        stats.setTotalCompanies(entrepriseRepository.count());
        stats.setTotalInternships(offreStageRepository.count());
        stats.setTotalConventions(conventionRepository.count());
        stats.setActiveInternships(offreStageRepository.count()); // Ajuster selon statut
        stats.setPendingConventions(conventionRepository.countByStatutConvention(StatutConvention.EN_ATTENTE));
        return stats;
    }
}