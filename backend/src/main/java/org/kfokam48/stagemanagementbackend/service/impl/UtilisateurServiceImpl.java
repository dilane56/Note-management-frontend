package org.kfokam48.stagemanagementbackend.service.impl;

import org.kfokam48.stagemanagementbackend.dto.utilisateur.UtilisateurResponseDTO;
import org.kfokam48.stagemanagementbackend.exception.RessourceNotFoundException;
import org.kfokam48.stagemanagementbackend.mapper.UtilisateurMappeur;
import org.kfokam48.stagemanagementbackend.model.Utilisateur;
import org.kfokam48.stagemanagementbackend.repository.UtilisateurRepository;
import org.kfokam48.stagemanagementbackend.service.UtilisateurService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class UtilisateurServiceImpl implements UtilisateurService {

    private final UtilisateurRepository utilisateurRepository;
    private final UtilisateurMappeur utilisateurMappeur;

    public UtilisateurServiceImpl(UtilisateurRepository utilisateurRepository, UtilisateurMappeur utilisateurMappeur) {
        this.utilisateurRepository = utilisateurRepository;
        this.utilisateurMappeur = utilisateurMappeur;
    }


    @Override
    public UtilisateurResponseDTO getUtilisateurById(Long id) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RessourceNotFoundException("Utilisateur not found"));
        return  utilisateurMappeur.utilisateurToUtilisateurResponseDTO(utilisateur);
    }



    @Override
    public UtilisateurResponseDTO getUtilisateurByEmail(String email) {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RessourceNotFoundException("Utilisateur not found"));
        return utilisateurMappeur.utilisateurToUtilisateurResponseDTO(utilisateur);
    }

    @Override
    public List<UtilisateurResponseDTO> getAllUtilisateurs() {
        return utilisateurMappeur.utilisateursToUtilisateurResponseDTOs(utilisateurRepository.findAll());
    }

    @Override
    public ResponseEntity<String> deleteUtilisateurById(Long id) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RessourceNotFoundException("Utilisateur not found"));
        utilisateurRepository.delete(utilisateur);
        return ResponseEntity.ok("Utilisateur deleted successfully");
    }

    @Override
    public boolean existsByEmail(String email) {
        return utilisateurRepository.existsByEmail(email);
    }


}
