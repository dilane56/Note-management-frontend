package org.kfokam48.notemanagementbackend.service;

import org.kfokam48.notemanagementbackend.dto.ChartDataDTO;

public interface ChartService {
    public ChartDataDTO getChartDataForStudent(Long studentId);
}
