package org.kfokam48.stagemanagementbackend.dto.stats;

import lombok.Data;

@Data
public class EtudiantStatsDTO {
    private Long availableInternships;
    private Long myApplications;
    private Long acceptedApplications;
    private Long pendingApplications;
}