package org.kfokam48.stagemanagementbackend.service;

import org.kfokam48.stagemanagementbackend.dto.enseigant.EnseignantDTO;
import org.kfokam48.stagemanagementbackend.dto.enseigant.EnseignantResponseDTO;
import org.kfokam48.stagemanagementbackend.dto.enseigant.EnseignantUpdateDTO;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface EnseignantService {

     EnseignantResponseDTO createEnseignant(EnseignantDTO enseignantDTO);
     EnseignantResponseDTO getEnseignantById(Long id);
     List<EnseignantResponseDTO> getAllEnseignants();
     EnseignantResponseDTO updateEnseignant(Long id, EnseignantDTO enseignantDTO);
     ResponseEntity<String> deleteEnseignant(Long id);
}
