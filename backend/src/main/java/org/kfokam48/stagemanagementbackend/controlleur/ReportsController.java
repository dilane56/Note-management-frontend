package org.kfokam48.stagemanagementbackend.controlleur;

import lombok.RequiredArgsConstructor;
import org.kfokam48.stagemanagementbackend.dto.reports.StagesByFiliereDTO;
import org.kfokam48.stagemanagementbackend.service.ReportsService;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportsController {

    private final ReportsService reportsService;

    @GetMapping("/stages-by-filiere")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ENSEIGNANT')")
    public ResponseEntity<List<StagesByFiliereDTO>> getStagesByFiliere() {
        List<StagesByFiliereDTO> data = reportsService.getStagesByFiliere();
        return ResponseEntity.ok(data);
    }

    @GetMapping("/stages-by-filiere/export")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ENSEIGNANT')")
    public ResponseEntity<ByteArrayResource> exportStagesByFiliere() {
        byte[] excelData = reportsService.exportStagesByFiliereToExcel();
        ByteArrayResource resource = new ByteArrayResource(excelData);
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=stages-by-filiere.xlsx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }

    @GetMapping("/active-users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<org.kfokam48.stagemanagementbackend.dto.reports.ActiveUsersDTO>> getActiveUsers() {
        List<org.kfokam48.stagemanagementbackend.dto.reports.ActiveUsersDTO> data = reportsService.getActiveUsers();
        return ResponseEntity.ok(data);
    }

    @GetMapping("/active-users/export")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ByteArrayResource> exportActiveUsers() {
        byte[] excelData = reportsService.exportActiveUsersToExcel();
        ByteArrayResource resource = new ByteArrayResource(excelData);
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=active-users.xlsx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }

    @GetMapping("/company-partners")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ENSEIGNANT')")
    public ResponseEntity<List<org.kfokam48.stagemanagementbackend.dto.reports.CompanyPartnersDTO>> getCompanyPartners() {
        List<org.kfokam48.stagemanagementbackend.dto.reports.CompanyPartnersDTO> data = reportsService.getCompanyPartners();
        return ResponseEntity.ok(data);
    }

    @GetMapping("/company-partners/export")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ENSEIGNANT')")
    public ResponseEntity<ByteArrayResource> exportCompanyPartners() {
        byte[] excelData = reportsService.exportCompanyPartnersToExcel();
        ByteArrayResource resource = new ByteArrayResource(excelData);
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=company-partners.xlsx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }

    @GetMapping("/stages/{year}/export")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ENSEIGNANT')")
    public ResponseEntity<ByteArrayResource> exportStagesByYear(@PathVariable LocalDate year) {
        byte[] excelData = reportsService.exportStagesByYear(year);
        ByteArrayResource resource = new ByteArrayResource(excelData);
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=stages-" + year + ".xlsx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }

    @GetMapping("/conventions/signed/export")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ENSEIGNANT')")
    public ResponseEntity<ByteArrayResource> exportSignedConventions() {
        byte[] excelData = reportsService.exportSignedConventions();
        ByteArrayResource resource = new ByteArrayResource(excelData);
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=conventions-signees.xlsx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }

    @GetMapping("/users/export")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ByteArrayResource> exportAllUsers() {
        byte[] excelData = reportsService.exportAllUsers();
        ByteArrayResource resource = new ByteArrayResource(excelData);
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=tous-utilisateurs.xlsx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }

    @GetMapping("/export-all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ByteArrayResource> exportAllData() {
        byte[] excelData = reportsService.exportAllData();
        ByteArrayResource resource = new ByteArrayResource(excelData);
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=export-complet.xlsx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }
}