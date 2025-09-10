package org.kfokam48.stagemanagementbackend.dto.stats;

import lombok.Data;

@Data
public class EnseignantStatsDTO {
    private Long totalConventions;
    private Long pendingConventions;
    private Long studentsFollowed;
    private Long completedInternships;
}