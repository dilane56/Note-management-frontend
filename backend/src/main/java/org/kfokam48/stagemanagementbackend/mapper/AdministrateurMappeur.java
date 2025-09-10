package org.kfokam48.stagemanagementbackend.mapper;

import org.kfokam48.stagemanagementbackend.dto.administrateur.AdministrateurDTO;
import org.kfokam48.stagemanagementbackend.dto.administrateur.AdministrateurResponseDTO;
import org.kfokam48.stagemanagementbackend.dto.administrateur.AdministrateurUpdateDTO;
import org.kfokam48.stagemanagementbackend.model.Administrateur;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AdministrateurMappeur {
    private ModelMapper modelMapper;

    public AdministrateurMappeur(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    public Administrateur adminsitrateurDTOToAdministrateur(AdministrateurDTO administrateurDTO) {
        return modelMapper.map(administrateurDTO, Administrateur.class);
    }

    public AdministrateurResponseDTO administrateurToAdministareurReponseDTO(Administrateur administrateur) {
        return modelMapper.map(administrateur, AdministrateurResponseDTO.class);
    }

    public Administrateur administrateurUpdateDTOToAdministrateur(AdministrateurUpdateDTO administrateurUpdateDTO) {
        return modelMapper.map(administrateurUpdateDTO, Administrateur.class);
    }

    public List<AdministrateurResponseDTO> administrateurListToAdministrateurResponseDTOList(List<Administrateur> administrateurs) {
        return administrateurs.stream()
                .map(this::administrateurToAdministareurReponseDTO)
                .toList();
    }
}
