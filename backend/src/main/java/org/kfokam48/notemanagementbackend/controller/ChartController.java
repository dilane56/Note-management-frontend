package org.kfokam48.notemanagementbackend.controller;

import org.kfokam48.notemanagementbackend.dto.ChartDataDTO;
import org.kfokam48.notemanagementbackend.service.impl.ChartServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ChartController {
    private final ChartServiceImpl chartService;

    public ChartController(ChartServiceImpl chartService) {
        this.chartService = chartService;
    }

    @GetMapping("/students/{id}/grades/chart-data")
    public ResponseEntity<ChartDataDTO> getStudentGradesChartData(@PathVariable Long id) {
        return ResponseEntity.ok(chartService.getChartDataForStudent(id));
    }
}
