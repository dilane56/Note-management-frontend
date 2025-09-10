package org.kfokam48.stagemanagementbackend.service;

import org.kfokam48.stagemanagementbackend.dto.stats.*;

public interface StatsService {
    EtudiantStatsDTO getEtudiantStats(Long etudiantId);
    EntrepriseStatsDTO getEntrepriseStats(Long entrepriseId);
    EnseignantStatsDTO getEnseignantStats(Long enseignantId);
    AdminStatsDTO getAdminStats();
}