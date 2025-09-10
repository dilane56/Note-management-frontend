package org.kfokam48.stagemanagementbackend.service;

import org.kfokam48.stagemanagementbackend.dto.candidature.CandidatureDTO;
import org.kfokam48.stagemanagementbackend.dto.candidature.CandidatureResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface CandidatureService {

    public CandidatureResponseDTO getCandidatureById(Long id);
    public List<CandidatureResponseDTO> getAllCandidatures();
    public List<CandidatureResponseDTO> getCandidaturesByEtudiant(Long etudiantId);
    public List<CandidatureResponseDTO> getCandidaturesByEntreprise(Long entrepriseId);
    CandidatureResponseDTO updateCandidature(Long id, Long idEtudiant, Long idOffre, String lettreMotivation, MultipartFile file) throws Exception;
    CandidatureResponseDTO addCandidature(CandidatureDTO candidatureDTO, MultipartFile file) throws IOException, Exception;
    ResponseEntity<String> updateCandidatureStatut(Long id, String statut, String message) throws IOException;
    public ResponseEntity<String> deleteCandidature(Long id);
    public  ResponseEntity<String> uploadImage(MultipartFile file, Long id) throws IOException, Exception;

}
