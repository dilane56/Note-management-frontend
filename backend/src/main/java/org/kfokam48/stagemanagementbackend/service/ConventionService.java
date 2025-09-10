package org.kfokam48.stagemanagementbackend.service;

import org.kfokam48.stagemanagementbackend.dto.convention.ConventionRequestDTO;
import org.kfokam48.stagemanagementbackend.dto.convention.ConventionResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ConventionService {
    public ConventionResponseDTO findByConventionId(Long conventionId);
    ConventionResponseDTO createConvention(ConventionRequestDTO conventionRequestDTO) throws Exception;
    ConventionResponseDTO updateConvention(Long conventionId, Long idCandidature) throws Exception;
    public String deleteConvention(Long conventionId);
    public List<ConventionResponseDTO> findAllConventions();
    public List<ConventionResponseDTO> findConventionsByEntreprise(Long entrepriseId);
    public List<ConventionResponseDTO> findConventionsByEnseignant(Long enseignantId);
    ConventionResponseDTO validateConventionByEnseignant(Long enseigantId, Long conventionId) throws IOException;
    ConventionResponseDTO approuveConventionByAdministrator(Long administratorId, Long conventionId) throws IOException;
    ResponseEntity<byte[]> generateConventionPdf(Long conventionId) throws Exception;
}
