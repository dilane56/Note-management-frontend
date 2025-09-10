package org.kfokam48.stagemanagementbackend.dto.stats;

import lombok.Data;

@Data
public class EntrepriseStatsDTO {
    private Long publishedOffers;
    private Long receivedApplications;
    private Long acceptedApplications;
    private Long pendingApplications;
}