package org.kfokam48.stagemanagementbackend.mapper;

import org.kfokam48.stagemanagementbackend.dto.enseigant.EnseignantDTO;
import org.kfokam48.stagemanagementbackend.dto.enseigant.EnseignantResponseDTO;
import org.kfokam48.stagemanagementbackend.dto.enseigant.EnseignantUpdateDTO;
import org.kfokam48.stagemanagementbackend.model.Enseignant;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.List;
@Component
public class EnseignantMapper {
    private ModelMapper modelMapper;

    public EnseignantMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    public Enseignant enseigantDTOToEnseignant(EnseignantDTO enseignantDTO) {
       return modelMapper.map(enseignantDTO, Enseignant.class);
    }

    public EnseignantResponseDTO enseignantToEnseignantResponseDTO(Enseignant enseignant) {
        return modelMapper.map(enseignant, EnseignantResponseDTO.class);
    }
    public Enseignant enseigantUpdateDTOToEnseigant(EnseignantUpdateDTO enseignantUpdateDTO) {
        return modelMapper.map(enseignantUpdateDTO, Enseignant.class);
    }
    public List<EnseignantResponseDTO> enseigantListToEnseigantResponseDTOs(List<Enseignant> enseignants) {
        return enseignants.stream()
                .map(this::enseignantToEnseignantResponseDTO)
                .toList();
    }


}
