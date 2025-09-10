package org.kfokam48.notemanagementbackend.mapper;

import org.kfokam48.notemanagementbackend.dto.filiere.FiliereRequestDTO;

import org.kfokam48.notemanagementbackend.dto.filiere.FiliereResponseDTO;
import org.kfokam48.notemanagementbackend.model.Filiere;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class FilierreMapper {
    private ModelMapper modelMapper;

    public FilierreMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    public Filiere filieRequestDTOToFiliere(FiliereRequestDTO filiereRequestDTO) {
       return modelMapper.map(filiereRequestDTO, Filiere.class);
    }
    public FiliereResponseDTO filiereToFiliereResponseDTO(Filiere filiere) {
        return modelMapper.map(filiere, FiliereResponseDTO.class);
    }

    public List<FiliereResponseDTO> filiereToFiliereResponseDTO(List<Filiere> filieres) {
        return modelMapper.map(filieres, List.class);
    }
}
