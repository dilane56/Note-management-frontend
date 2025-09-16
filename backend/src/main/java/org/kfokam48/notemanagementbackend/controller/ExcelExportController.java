package org.kfokam48.notemanagementbackend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.kfokam48.notemanagementbackend.service.excel.ExcelExportService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/exports")
@RequiredArgsConstructor
@Tag(name = "Excel Export", description = "API pour l'export Excel")
public class ExcelExportController {

    private final ExcelExportService excelExportService;

    @GetMapping("/students/class/{classId}")
    @Operation(summary = "Exporter la liste des étudiants d'une classe")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<byte[]> exportStudentsList(@PathVariable Long classId) {
        try {
            byte[] excelData = excelExportService.exportStudentsList(classId);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", "liste_etudiants_classe_" + classId + ".xlsx");
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(excelData);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/teachers")
    @Operation(summary = "Exporter la liste des enseignants")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<byte[]> exportTeachersList() {
        try {
            byte[] excelData = excelExportService.exportTeachersList();
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", "liste_enseignants.xlsx");
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(excelData);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/statistics/class/{classId}/evaluation/{evaluationId}")
    @Operation(summary = "Exporter les statistiques d'une classe pour une évaluation")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<byte[]> exportClassStatistics(
            @PathVariable Long classId,
            @PathVariable Long evaluationId) {
        try {
            byte[] excelData = excelExportService.exportClassStatistics(classId, evaluationId);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", 
                    "statistiques_classe_" + classId + "_evaluation_" + evaluationId + ".xlsx");
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(excelData);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/complete/class/{classId}/evaluation/{evaluationId}")
    @Operation(summary = "Exporter toutes les données d'une classe (liste + statistiques)")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<byte[]> exportCompleteClassData(
            @PathVariable Long classId,
            @PathVariable Long evaluationId) {
        try {
            byte[] excelData = excelExportService.exportCompleteClassData(classId, evaluationId);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", 
                    "donnees_completes_classe_" + classId + "_evaluation_" + evaluationId + ".xlsx");
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(excelData);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}