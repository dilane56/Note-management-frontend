package org.kfokam48.stagemanagementbackend.service.impl;

import org.kfokam48.stagemanagementbackend.dto.entreprise.EntrepriseDTO;
import org.kfokam48.stagemanagementbackend.dto.entreprise.EntrepriseReponseDTO;
import org.kfokam48.stagemanagementbackend.dto.entreprise.EntrepriseUpdateDTO;
import org.kfokam48.stagemanagementbackend.enums.Roles;
import org.kfokam48.stagemanagementbackend.exception.RessourceNotFoundException;
import org.kfokam48.stagemanagementbackend.mapper.EntrepriseMapper;
import org.kfokam48.stagemanagementbackend.model.Entreprise;
import org.kfokam48.stagemanagementbackend.model.embeded.Profile;
import org.kfokam48.stagemanagementbackend.repository.EntrepriseRepository;
import org.kfokam48.stagemanagementbackend.repository.UtilisateurRepository;
import org.kfokam48.stagemanagementbackend.service.EntrepriseService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class EntrepriseServiceImpl implements EntrepriseService {
    private final EntrepriseRepository entrepriseRepository;
    private final EntrepriseMapper entrepriseMapper;
    private final UtilisateurRepository utilisateurRepository;
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    public EntrepriseServiceImpl(EntrepriseRepository entrepriseRepository, EntrepriseMapper entrepriseMapper, UtilisateurRepository utilisateurRepository) {
        this.entrepriseRepository = entrepriseRepository;
        this.entrepriseMapper = entrepriseMapper;
        this.utilisateurRepository = utilisateurRepository;
    }

    @Override
    public EntrepriseReponseDTO getEntrepriseById(Long id) {
        Entreprise entreprise = entrepriseRepository.findById(id)
                .orElseThrow(() -> new RessourceNotFoundException("Entreprise not found"));

        return entrepriseMapper.entrepriseToEntrepriseReponseDTO(entreprise);
    }

    @Override
    public EntrepriseReponseDTO creerEntreprise(EntrepriseDTO entrepriseDTO) {
        if (utilisateurRepository.existsByEmail(entrepriseDTO.getEmail())) {
            throw new RuntimeException("User already exists with this email");
        }
        Entreprise entreprise = entrepriseMapper.entrepriseDTOToEntreprise(entrepriseDTO);
        entreprise.setRole(Roles.ENTREPRISE);
        entreprise.setPassword(passwordEncoder().encode(entrepriseDTO.getPassword()));
        
        // Remplir le Profile avec les informations spécifiques à l'entreprise
        Profile profile = new Profile();
        profile.setDomaineActivite(entreprise.getDomaineActivite());
        profile.setSiteWeb(entreprise.getSiteWeb());
        profile.setDescription(entreprise.getDescription());
        if (entreprise.getDateCreation() != null) {
            profile.setDateCreation(entreprise.getDateCreation().toString());
        }
        entreprise.setProfile(profile);
        return entrepriseMapper.entrepriseToEntrepriseReponseDTO(entrepriseRepository.save(entreprise));
    }

    @Override
    public EntrepriseReponseDTO modifierEntreprise(Long id, EntrepriseDTO entrepriseDTO) {
        Entreprise entreprise = entrepriseRepository.findById(id)
                .orElseThrow(() -> new RessourceNotFoundException("Entreprise not found"));
        if (entrepriseDTO.getEmail() != null && !entrepriseDTO.getEmail().equals(entreprise.getEmail())) {
            if (utilisateurRepository.existsByEmail(entrepriseDTO.getEmail())) {
                throw new RuntimeException("User already exists with this email");
            }
        }
        entreprise.setDomaineActivite(entrepriseDTO.getDomaineActivite());
        entreprise.setSiteWeb(entrepriseDTO.getSiteWeb());
        entreprise.setDescription(entrepriseDTO.getDescription());
        entreprise.setDateCreation(entrepriseDTO.getDateCreation());
        entreprise.setEmail(entrepriseDTO.getEmail());
        entreprise.setFullName(entrepriseDTO.getFullName());
        entreprise.setTelephone(entrepriseDTO.getTelephone());
        entreprise.setAvatar(entrepriseDTO.getAvatar());
        entreprise.setPassword(passwordEncoder().encode(entrepriseDTO.getPassword()));
        entreprise.setRole(Roles.ENTREPRISE);
        entreprise.setUpdateAt(LocalDate.now());
        
        // Mettre à jour le Profile
        Profile profile = entreprise.getProfile() != null ? entreprise.getProfile() : new Profile();
        profile.setDomaineActivite(entreprise.getDomaineActivite());
        profile.setSiteWeb(entreprise.getSiteWeb());
        profile.setDescription(entreprise.getDescription());
        if (entreprise.getDateCreation() != null) {
            profile.setDateCreation(entreprise.getDateCreation().toString());
        }
        entreprise.setProfile(profile);
        
        entrepriseRepository.save(entreprise);
        return entrepriseMapper.entrepriseToEntrepriseReponseDTO(entreprise);
    }

    @Override
    public ResponseEntity<String> supprimerEntreprise(Long id) {
        Entreprise entreprise = entrepriseRepository.findById(id)
                .orElseThrow(() -> new RessourceNotFoundException("Entreprise not found"));
        entrepriseRepository.delete(entreprise);
        return ResponseEntity.ok("Entreprise deleted successfully");
    }

    @Override
    public List<EntrepriseReponseDTO> getAllEntreprises() {
        return entrepriseMapper.entreprisesToEntreprisesReponseDTO(entrepriseRepository.findAll());
    }
}
