package org.kfokam48.stagemanagementbackend.mapper;

import org.kfokam48.stagemanagementbackend.dto.offreStage.OffreStageInEntrepriseDTO;
import org.kfokam48.stagemanagementbackend.dto.entreprise.EntrepriseDTO;
import org.kfokam48.stagemanagementbackend.dto.entreprise.EntrepriseReponseDTO;
import org.kfokam48.stagemanagementbackend.model.Entreprise;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class EntrepriseMapper {
    private final ModelMapper modelMapper;

    public EntrepriseMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }


    public Entreprise entrepriseDTOToEntreprise(EntrepriseDTO entrepriseDTO) {
        return modelMapper.map(entrepriseDTO, Entreprise.class);
    }
    public EntrepriseReponseDTO entrepriseToEntrepriseReponseDTO(Entreprise entreprise) {
        EntrepriseReponseDTO entrepriseReponseDTO = new EntrepriseReponseDTO();
        entrepriseReponseDTO.setId(entreprise.getId());
        entrepriseReponseDTO.setEmail(entreprise.getEmail());
        entrepriseReponseDTO.setFullName(entreprise.getFullName());
        entrepriseReponseDTO.setTelephone(entreprise.getTelephone());
        entrepriseReponseDTO.setAvatar(entreprise.getAvatar());
        entrepriseReponseDTO.setRole(entreprise.getRole());
        entrepriseReponseDTO.setCreateAt(entreprise.getCreateAt());
        entrepriseReponseDTO.setUpdateAt(entreprise.getUpdateAt());
        entrepriseReponseDTO.setDomaineActivite(entreprise.getDomaineActivite());
        entrepriseReponseDTO.setSiteWeb(entreprise.getSiteWeb());
        entrepriseReponseDTO.setDescription(entreprise.getDescription());
        entrepriseReponseDTO.setDateCreation(entreprise.getDateCreation());
        entrepriseReponseDTO.setOffres(entreprise.getOffres().stream()
                .map(offreStage -> modelMapper.map(offreStage, OffreStageInEntrepriseDTO.class))
                .toList());
        return entrepriseReponseDTO;
    }

    public List<EntrepriseReponseDTO> entreprisesToEntreprisesReponseDTO(List<Entreprise> entreprises) {
        return entreprises.stream()
                .map(this::entrepriseToEntrepriseReponseDTO)
                .toList();
    }

}
