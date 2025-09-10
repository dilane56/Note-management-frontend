package org.kfokam48.stagemanagementbackend.mapper;

import org.kfokam48.stagemanagementbackend.dto.candidature.CandidatureResponseDTO;
import org.kfokam48.stagemanagementbackend.dto.convention.ConventionRequestDTO;
import org.kfokam48.stagemanagementbackend.dto.convention.ConventionResponseDTO;
import org.kfokam48.stagemanagementbackend.exception.RessourceNotFoundException;
import org.kfokam48.stagemanagementbackend.model.ConventionStage;
import org.kfokam48.stagemanagementbackend.repository.AdministrateurRepository;
import org.kfokam48.stagemanagementbackend.repository.CandidatureRepository;
import org.kfokam48.stagemanagementbackend.repository.EnseignantRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.List;
@Component
public class ConventionMapper {
    private final ModelMapper modelMapper;
    private final EnseignantRepository enseignantRepository;
    private final AdministrateurRepository administrateurRepository;
    private final CandidatureRepository candidatureRepository;
    private final CandidatureMapper candidatureMapper;

    public ConventionMapper(ModelMapper modelMapper, EnseignantRepository enseignantRepository, AdministrateurRepository administrateurRepository, CandidatureRepository candidatureRepository, CandidatureMapper candidatureMapper) {
        this.modelMapper = modelMapper;
        this.enseignantRepository = enseignantRepository;
        this.administrateurRepository = administrateurRepository;
        this.candidatureRepository = candidatureRepository;
        this.candidatureMapper = candidatureMapper;
    }
    public ConventionStage conventionRequestDTOToCoventionStage(ConventionRequestDTO conventionRequestDTO) {
       ConventionStage conventionStage = new ConventionStage();
       conventionStage.setCandidature(candidatureRepository.findById(conventionRequestDTO.getIdCandidature()).orElseThrow(()->new RessourceNotFoundException("Candidature Not Found")));
       return conventionStage;
    }

    public ConventionResponseDTO conventionStageToConventionResponseDTO(ConventionStage conventionStage) {
        ConventionResponseDTO conventionResponseDTO = new ConventionResponseDTO();
        conventionResponseDTO.setIdConvention(conventionStage.getId());
//        conventionResponseDTO.setPdfConventionPath(conventionStage.getPdfConventionPath());
        conventionResponseDTO.setDateDebut(conventionStage.getDateDebut());
        conventionResponseDTO.setDateFin(conventionStage.getDateFin());
        conventionResponseDTO.setDateAprouval(conventionStage.getDateAprouval());
        conventionResponseDTO.setDateValidation(conventionStage.getDateValidation());
        conventionResponseDTO.setDateCreation(conventionStage.getDateCreation());
        if(conventionStage.getEnseignantValideur() == null) {
            conventionResponseDTO.setEnseignantName("");
        }else {
            conventionResponseDTO.setEnseignantName(conventionStage.getEnseignantValideur().getFullName());
        }
        if(conventionStage.getAprouvalAdministrator() == null) {
            conventionResponseDTO.setAdministratorName("");
        }else{
            conventionResponseDTO.setAdministratorName(conventionStage.getAprouvalAdministrator().getFullName());
        }
        conventionResponseDTO.setStatutConvention(conventionStage.getStatutConvention());
        CandidatureResponseDTO candidatureResponseDTO = candidatureMapper.candidatureToCandidatureResponseDTO(conventionStage.getCandidature());
        conventionResponseDTO.setCandidature(candidatureResponseDTO);
        return conventionResponseDTO;

    }

    public List<ConventionResponseDTO> conventionStageToConventionResponseDTOList(List<ConventionStage> conventionStageList) {
      return   conventionStageList.stream()
                .map(this::conventionStageToConventionResponseDTO)
                .toList();
    }
}
