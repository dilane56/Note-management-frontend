package org.kfokam48.stagemanagementbackend.service;

import org.kfokam48.stagemanagementbackend.dto.etudiant.EtudiantDTO;
import org.kfokam48.stagemanagementbackend.dto.etudiant.EtudiantResponseDTO;
import org.kfokam48.stagemanagementbackend.dto.etudiant.EtudiantUpdateDTO;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface Etudiantservice {

    public EtudiantResponseDTO createEtudiant(EtudiantDTO etudiantDTO);
    public EtudiantResponseDTO getEtudiantById(Long id);
    public List<EtudiantResponseDTO> getAllEtudiants();
    public List<EtudiantResponseDTO> getEtudiantsByEnseignant(Long enseignantId);
    public EtudiantResponseDTO updateEtudiant(Long id, EtudiantDTO etudiantDTO);
    public ResponseEntity<String> deleteEtudiant(Long id);
}
