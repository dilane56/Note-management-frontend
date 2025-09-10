package org.kfokam48.stagemanagementbackend.mapper;

import org.kfokam48.stagemanagementbackend.dto.etudiant.EtudiantDTO;
import org.kfokam48.stagemanagementbackend.dto.etudiant.EtudiantResponseDTO;
import org.kfokam48.stagemanagementbackend.dto.etudiant.EtudiantUpdateDTO;
import org.kfokam48.stagemanagementbackend.model.Etudiant;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.List;
@Component
public class EtudiantMapper {
    private final ModelMapper modelMapper;

    public EtudiantMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }
    public Etudiant etudiantDtoToEtudiant (EtudiantDTO etudiantDTO){
        return modelMapper.map(etudiantDTO, Etudiant.class);
    }
    public EtudiantResponseDTO etudiantToEtudiantResponseDTO (Etudiant etudiant){
        return modelMapper.map(etudiant, EtudiantResponseDTO.class);
    }
   public Etudiant etudiantUpdateDTOToEtudiant(EtudiantUpdateDTO etudiantUpdateDTO) {
        return modelMapper.map(etudiantUpdateDTO, Etudiant.class);
    }

    public List<EtudiantResponseDTO> etudiantsToEtudiantResponseDTOs (List<Etudiant> etudiants){
        return etudiants.stream()
                .map(this::etudiantToEtudiantResponseDTO)
                .toList();
    }

}
