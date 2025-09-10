package org.kfokam48.notemanagementbackend.controller;

import org.kfokam48.notemanagementbackend.service.StatistiqueService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class StatistiqueController {
        private final StatistiqueService statistiqueService;

    public StatistiqueController(StatistiqueService statistiqueService) {
        this.statistiqueService = statistiqueService;
    }

    @GetMapping("/students/{id}/average")
    public ResponseEntity<Double> getStudentAverage(@PathVariable Long id) {
        return ResponseEntity.ok(statistiqueService.calculateStudentAverage(id));
    }
}
