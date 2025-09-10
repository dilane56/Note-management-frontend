package org.kfokam48.stagemanagementbackend.service;

import org.kfokam48.stagemanagementbackend.dto.administrateur.AdministrateurDTO;
import org.kfokam48.stagemanagementbackend.dto.administrateur.AdministrateurResponseDTO;
import org.kfokam48.stagemanagementbackend.dto.administrateur.AdministrateurUpdateDTO;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface AdministrateurService {

    public AdministrateurResponseDTO getAdministrateurById(Long id);
    public AdministrateurResponseDTO createAdministrateur(AdministrateurDTO administrateurDTO);
    public AdministrateurResponseDTO updateAdministrateur(Long id, AdministrateurUpdateDTO administrateurUpdateDTO);
    public ResponseEntity<String> deleteAdministrateur(Long id);
    public List<AdministrateurResponseDTO> getAllAdministrateurs();
}
