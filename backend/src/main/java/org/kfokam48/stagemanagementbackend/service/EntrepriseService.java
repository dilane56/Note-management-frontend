package org.kfokam48.stagemanagementbackend.service;

import org.kfokam48.stagemanagementbackend.dto.entreprise.EntrepriseDTO;
import org.kfokam48.stagemanagementbackend.dto.entreprise.EntrepriseReponseDTO;
import org.kfokam48.stagemanagementbackend.dto.entreprise.EntrepriseUpdateDTO;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface EntrepriseService {

    public EntrepriseReponseDTO getEntrepriseById(Long id);
    public EntrepriseReponseDTO creerEntreprise(EntrepriseDTO entrepriseDTO);
    public EntrepriseReponseDTO modifierEntreprise(Long id, EntrepriseDTO entrepriseDTO);
    public ResponseEntity<String> supprimerEntreprise(Long id);
    public List<EntrepriseReponseDTO> getAllEntreprises();
}
