package org.kfokam48.notemanagementbackend.service.impl;


import org.kfokam48.notemanagementbackend.dto.filiere.FiliereRequestDTO;
import org.kfokam48.notemanagementbackend.dto.filiere.FiliereResponseDTO;
import org.kfokam48.notemanagementbackend.exception.RessourceNotFoundException;
import org.kfokam48.notemanagementbackend.mapper.FilierreMapper;
import org.kfokam48.notemanagementbackend.model.Filiere;
import org.kfokam48.notemanagementbackend.repository.FiliereRepository;
import org.kfokam48.notemanagementbackend.service.FiliereService;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class FiliereServiceImpl implements FiliereService {
    private final FiliereRepository filiereRepository;
    private final FilierreMapper filierreMapper;

    public FiliereServiceImpl(FiliereRepository filiereRepository, FilierreMapper filierreMapper) {
        this.filiereRepository = filiereRepository;
        this.filierreMapper = filierreMapper;
    }


    @Override
    public FiliereResponseDTO getFiliere(Long idFiliere) {
        Filiere filiere = filiereRepository.findById(idFiliere).orElseThrow(()->new RessourceNotFoundException("Filiere not found"));
        return filierreMapper.filiereToFiliereResponseDTO(filiere);
    }

    @Override
    public FiliereResponseDTO createFiliere(FiliereRequestDTO filiere) {
       return filierreMapper.filiereToFiliereResponseDTO(filiereRepository.save(filierreMapper.filieRequestDTOToFiliere(filiere)));
    }

    @Override
    public FiliereResponseDTO updateFiliere(FiliereRequestDTO filiere, Long idFiliere) {
        Filiere filiere1 = filiereRepository.findById(idFiliere).orElseThrow(()->new RessourceNotFoundException("Filiere not found"));
        filiere1.setName(filiere.getName());
        filiereRepository.save(filiere1);
        return filierreMapper.filiereToFiliereResponseDTO(filiere1);
    }

    @Override
    public String deleteFiliere(Long idFiliere) {
        Filiere filiere = filiereRepository.findById(idFiliere).orElseThrow(()->new RessourceNotFoundException("Filiere not found"));
        filiereRepository.delete(filiere);
        return "Filiere deleted Successfully";
    }

    @Override
    public List<FiliereResponseDTO> getAllFilieres() {
        return filierreMapper.filiereToFiliereResponseDTO(filiereRepository.findAll());
    }
}
