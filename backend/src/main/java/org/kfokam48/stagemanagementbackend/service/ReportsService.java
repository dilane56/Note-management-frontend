package org.kfokam48.stagemanagementbackend.service;

import org.kfokam48.stagemanagementbackend.dto.reports.ActiveUsersDTO;
import org.kfokam48.stagemanagementbackend.dto.reports.CompanyPartnersDTO;
import org.kfokam48.stagemanagementbackend.dto.reports.StagesByFiliereDTO;

import java.time.LocalDate;
import java.util.List;

public interface ReportsService {
    List<StagesByFiliereDTO> getStagesByFiliere();
    byte[] exportStagesByFiliereToExcel();
    List<ActiveUsersDTO> getActiveUsers();
    byte[] exportActiveUsersToExcel();
    List<CompanyPartnersDTO> getCompanyPartners();
    byte[] exportCompanyPartnersToExcel();
    byte[] exportStagesByYear(LocalDate year);
    byte[] exportSignedConventions();
    byte[] exportAllUsers();
    byte[] exportAllData();
}