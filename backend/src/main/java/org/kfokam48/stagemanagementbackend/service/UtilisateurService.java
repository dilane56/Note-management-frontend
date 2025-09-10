package org.kfokam48.stagemanagementbackend.service;

import org.kfokam48.stagemanagementbackend.dto.utilisateur.UtilisateurResponseDTO;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface UtilisateurService {

    public UtilisateurResponseDTO getUtilisateurById(Long id);

    public UtilisateurResponseDTO getUtilisateurByEmail(String email);
    public List<UtilisateurResponseDTO> getAllUtilisateurs();
    public ResponseEntity<String> deleteUtilisateurById(Long id);
    boolean existsByEmail(String email);

}
