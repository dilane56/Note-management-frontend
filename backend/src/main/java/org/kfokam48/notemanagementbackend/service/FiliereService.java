package org.kfokam48.notemanagementbackend.service;

import org.kfokam48.notemanagementbackend.dto.filiere.FiliereRequestDTO;
import org.kfokam48.notemanagementbackend.dto.filiere.FiliereResponseDTO;

import java.util.List;

public interface FiliereService {
    public FiliereResponseDTO getFiliere(Long idFiliere);
    public FiliereResponseDTO createFiliere(FiliereRequestDTO filiere);
    public FiliereResponseDTO updateFiliere(FiliereRequestDTO filiere, Long idFiliere);
    public String deleteFiliere(Long idFiliere);
    public List<FiliereResponseDTO> getAllFilieres();
}
