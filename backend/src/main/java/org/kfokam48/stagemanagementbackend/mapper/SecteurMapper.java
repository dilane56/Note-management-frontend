package org.kfokam48.stagemanagementbackend.mapper;

import org.kfokam48.stagemanagementbackend.dto.secteur.SecteurRequestDTO;
import org.kfokam48.stagemanagementbackend.model.Secteur;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class SecteurMapper {
    private final ModelMapper modelMapper;

    public SecteurMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }
    public Secteur secteurRequestDTOToSecteur(SecteurRequestDTO secteurRequestDTO) {
        return modelMapper.map(secteurRequestDTO, Secteur.class);
    }
}
