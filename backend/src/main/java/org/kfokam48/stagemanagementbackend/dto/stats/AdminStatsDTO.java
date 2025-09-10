package org.kfokam48.stagemanagementbackend.dto.stats;

import lombok.Data;

@Data
public class AdminStatsDTO {
    private Long totalUsers;
    private Long totalCompanies;
    private Long totalInternships;
    private Long totalConventions;
    private Long activeInternships;
    private Long pendingConventions;
}