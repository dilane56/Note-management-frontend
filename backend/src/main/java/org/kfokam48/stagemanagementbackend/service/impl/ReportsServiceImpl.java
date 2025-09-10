package org.kfokam48.stagemanagementbackend.service.impl;

import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.kfokam48.stagemanagementbackend.dto.reports.ActiveUsersDTO;
import org.kfokam48.stagemanagementbackend.dto.reports.CompanyPartnersDTO;
import org.kfokam48.stagemanagementbackend.dto.reports.StagesByFiliereDTO;
import org.kfokam48.stagemanagementbackend.enums.StatutConvention;
import org.kfokam48.stagemanagementbackend.enums.UserStatus;
import org.kfokam48.stagemanagementbackend.model.ConventionStage;
import org.kfokam48.stagemanagementbackend.model.Utilisateur;
import org.kfokam48.stagemanagementbackend.repository.CandidatureRepository;
import org.kfokam48.stagemanagementbackend.repository.ConventionStageRepository;
import org.kfokam48.stagemanagementbackend.repository.EntrepriseRepository;
import org.kfokam48.stagemanagementbackend.repository.OffreStageRepository;
import org.kfokam48.stagemanagementbackend.repository.UtilisateurRepository;
import org.kfokam48.stagemanagementbackend.service.ReportsService;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportsServiceImpl implements ReportsService {

    private final ConventionStageRepository conventionRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final EntrepriseRepository entrepriseRepository;
    private final OffreStageRepository offreStageRepository;
    private final CandidatureRepository candidatureRepository;

    @Override
    public List<StagesByFiliereDTO> getStagesByFiliere() {
        return conventionRepository.findAll().stream()
                .collect(Collectors.groupingBy(
                        convention -> convention.getCandidature().getEtudiant().getFiliere(),
                        Collectors.counting()
                ))
                .entrySet().stream()
                .map(entry -> {
                    StagesByFiliereDTO dto = new StagesByFiliereDTO();
                    dto.setFiliere(entry.getKey());
                    dto.setTotalStages(entry.getValue());
                    dto.setStagesEnCours(conventionRepository.countConventionStageByCandidature_Etudiant_FiliereAndStatutConvention(entry.getKey(), StatutConvention.APPROUVE));
                    dto.setStagesEnAttente(conventionRepository.countConventionStageByCandidature_Etudiant_FiliereAndStatutConvention(entry.getKey(), StatutConvention.EN_ATTENTE));
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public byte[] exportStagesByFiliereToExcel() {
        List<StagesByFiliereDTO> data = getStagesByFiliere();
        
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Stages par Filière");
            
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("Filière");
            headerRow.createCell(1).setCellValue("Total Stages");
            headerRow.createCell(2).setCellValue("En Cours");
            headerRow.createCell(3).setCellValue("Terminés");
            headerRow.createCell(4).setCellValue("En Attente");
            
            int rowNum = 1;
            for (StagesByFiliereDTO dto : data) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(dto.getFiliere());
                row.createCell(1).setCellValue(dto.getTotalStages());
                row.createCell(2).setCellValue(dto.getStagesEnCours());
                row.createCell(3).setCellValue(dto.getStagesTermines());
                row.createCell(4).setCellValue(dto.getStagesEnAttente());
            }
            
            workbook.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la génération du fichier Excel", e);
        }
    }

    @Override
    public List<ActiveUsersDTO> getActiveUsers() {
        return utilisateurRepository.findByStatus(UserStatus.EN_LIGNE).stream()
                .map(user -> {
                    ActiveUsersDTO dto = new ActiveUsersDTO();
                    dto.setId(user.getId());
                    dto.setFullName(user.getFullName());
                    dto.setEmail(user.getEmail());
                    dto.setRole(user.getRole());
                    dto.setDerniereConnexion(user.getDerniereConnexion());
                    dto.setStatus(user.getStatus().toString());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public byte[] exportActiveUsersToExcel() {
        List<ActiveUsersDTO> data = getActiveUsers();
        
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Utilisateurs Actifs");
            
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("ID");
            headerRow.createCell(1).setCellValue("Nom Complet");
            headerRow.createCell(2).setCellValue("Email");
            headerRow.createCell(3).setCellValue("Rôle");
            headerRow.createCell(4).setCellValue("Dernière Connexion");
            headerRow.createCell(5).setCellValue("Statut");
            
            int rowNum = 1;
            for (ActiveUsersDTO dto : data) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(dto.getId());
                row.createCell(1).setCellValue(dto.getFullName());
                row.createCell(2).setCellValue(dto.getEmail());
                row.createCell(3).setCellValue(dto.getRole().toString());
                row.createCell(4).setCellValue(dto.getDerniereConnexion() != null ? dto.getDerniereConnexion().toString() : "");
                row.createCell(5).setCellValue(dto.getStatus());
            }
            
            workbook.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la génération du fichier Excel", e);
        }
    }

    @Override
    public List<CompanyPartnersDTO> getCompanyPartners() {
        return entrepriseRepository.findAll().stream()
                .map(entreprise -> {
                    CompanyPartnersDTO dto = new CompanyPartnersDTO();
                    dto.setId(entreprise.getId());
                    dto.setFullName(entreprise.getFullName());
                    dto.setEmail(entreprise.getEmail());
                    dto.setDomaineActivite(entreprise.getProfile().getDomaineActivite());
                    dto.setSiteWeb(entreprise.getProfile().getSiteWeb());
                    dto.setTotalOffres(offreStageRepository.countByEntrepriseId(entreprise.getId()));
                    dto.setTotalCandidatures(candidatureRepository.countByOffreStageEntrepriseId(entreprise.getId()));
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public byte[] exportCompanyPartnersToExcel() {
        List<CompanyPartnersDTO> data = getCompanyPartners();
        
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Partenaires Entreprises");
            
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("ID");
            headerRow.createCell(1).setCellValue("Nom Entreprise");
            headerRow.createCell(2).setCellValue("Email");
            headerRow.createCell(3).setCellValue("Domaine d'Activité");
            headerRow.createCell(4).setCellValue("Site Web");
            headerRow.createCell(5).setCellValue("Total Offres");
            headerRow.createCell(6).setCellValue("Total Candidatures");
            
            int rowNum = 1;
            for (CompanyPartnersDTO dto : data) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(dto.getId());
                row.createCell(1).setCellValue(dto.getFullName());
                row.createCell(2).setCellValue(dto.getEmail());
                row.createCell(3).setCellValue(dto.getDomaineActivite() != null ? dto.getDomaineActivite() : "");
                row.createCell(4).setCellValue(dto.getSiteWeb() != null ? dto.getSiteWeb() : "");
                row.createCell(5).setCellValue(dto.getTotalOffres());
                row.createCell(6).setCellValue(dto.getTotalCandidatures());
            }
            
            workbook.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la génération du fichier Excel", e);
        }
    }

    @Override
    public byte[] exportStagesByYear(LocalDate year) {
        List<ConventionStage> conventions = conventionRepository.findByDateCreation(year);
        
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Stages " + year);
            
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("Étudiant");
            headerRow.createCell(1).setCellValue("Entreprise");
            headerRow.createCell(2).setCellValue("Titre Stage");
            headerRow.createCell(3).setCellValue("Date Début");
            headerRow.createCell(4).setCellValue("Date Fin");
            headerRow.createCell(5).setCellValue("Statut");
            
            int rowNum = 1;
            for (ConventionStage convention : conventions) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(convention.getCandidature().getEtudiant().getFullName());
                row.createCell(1).setCellValue(convention.getCandidature().getOffreStage().getEntreprise().getFullName());
                row.createCell(2).setCellValue(convention.getCandidature().getOffreStage().getIntitule());
                row.createCell(3).setCellValue(convention.getDateDebut() != null ? convention.getDateDebut().toString() : "");
                row.createCell(4).setCellValue(convention.getDateFin() != null ? convention.getDateFin().toString() : "");
                row.createCell(5).setCellValue(convention.getStatutConvention().toString());
            }
            
            workbook.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la génération du fichier Excel", e);
        }
    }

    @Override
    public byte[] exportSignedConventions() {
        List<ConventionStage> conventions = conventionRepository.findByStatutConvention(StatutConvention.APPROUVE);
        
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Conventions Signées");
            
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("Étudiant");
            headerRow.createCell(1).setCellValue("Entreprise");
            headerRow.createCell(2).setCellValue("Titre Stage");
            headerRow.createCell(3).setCellValue("Date Signature");
            headerRow.createCell(4).setCellValue("Enseignant Valideur");
            
            int rowNum = 1;
            for (ConventionStage convention : conventions) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(convention.getCandidature().getEtudiant().getFullName());
                row.createCell(1).setCellValue(convention.getCandidature().getOffreStage().getEntreprise().getFullName());
                row.createCell(2).setCellValue("Convetion de stage "+convention.getCandidature().getOffreStage().getIntitule() );
                row.createCell(3).setCellValue(convention.getDateAprouval() != null ? convention.getDateAprouval().toString() : "");
                row.createCell(4).setCellValue(convention.getEnseignantValideur() != null ? convention.getEnseignantValideur().getFullName() : "");
            }
            
            workbook.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la génération du fichier Excel", e);
        }
    }

    @Override
    public byte[] exportAllUsers() {
        List<Utilisateur> users = utilisateurRepository.findAll();
        
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Tous les Utilisateurs");
            
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("ID");
            headerRow.createCell(1).setCellValue("Nom Complet");
            headerRow.createCell(2).setCellValue("Email");
            headerRow.createCell(3).setCellValue("Rôle");
            headerRow.createCell(4).setCellValue("Date Création");
            headerRow.createCell(5).setCellValue("Statut");
            
            int rowNum = 1;
            for (Utilisateur user : users) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(user.getId());
                row.createCell(1).setCellValue(user.getFullName());
                row.createCell(2).setCellValue(user.getEmail());
                row.createCell(3).setCellValue(user.getRole().toString());
                row.createCell(4).setCellValue(user.getCreateAt() != null ? user.getCreateAt().toString() : "");
                row.createCell(5).setCellValue(user.getStatus() != null ? user.getStatus().toString() : "");
            }
            
            workbook.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la génération du fichier Excel", e);
        }
    }

    @Override
    public byte[] exportAllData() {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            
            // Feuille Utilisateurs
            Sheet usersSheet = workbook.createSheet("Utilisateurs");
            List<Utilisateur> users = utilisateurRepository.findAll();
            Row userHeader = usersSheet.createRow(0);
            userHeader.createCell(0).setCellValue("ID");
            userHeader.createCell(1).setCellValue("Nom");
            userHeader.createCell(2).setCellValue("Email");
            userHeader.createCell(3).setCellValue("Rôle");
            
            int userRowNum = 1;
            for (Utilisateur user : users) {
                Row row = usersSheet.createRow(userRowNum++);
                row.createCell(0).setCellValue(user.getId());
                row.createCell(1).setCellValue(user.getFullName());
                row.createCell(2).setCellValue(user.getEmail());
                row.createCell(3).setCellValue(user.getRole().toString());
            }
            
            // Feuille Conventions
            Sheet conventionsSheet = workbook.createSheet("Conventions");
            List<ConventionStage> conventions = conventionRepository.findAll();
            Row convHeader = conventionsSheet.createRow(0);
            convHeader.createCell(0).setCellValue("Étudiant");
            convHeader.createCell(1).setCellValue("Entreprise");
            convHeader.createCell(2).setCellValue("Statut");
            
            int convRowNum = 1;
            for (ConventionStage convention : conventions) {
                Row row = conventionsSheet.createRow(convRowNum++);
                row.createCell(0).setCellValue(convention.getCandidature().getEtudiant().getFullName());
                row.createCell(1).setCellValue(convention.getCandidature().getOffreStage().getEntreprise().getFullName());
                row.createCell(2).setCellValue(convention.getStatutConvention().toString());
            }
            
            workbook.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la génération du fichier Excel", e);
        }
    }
}