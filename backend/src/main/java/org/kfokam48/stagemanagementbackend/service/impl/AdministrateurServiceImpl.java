package org.kfokam48.stagemanagementbackend.service.impl;

import org.kfokam48.stagemanagementbackend.dto.administrateur.AdministrateurDTO;
import org.kfokam48.stagemanagementbackend.dto.administrateur.AdministrateurResponseDTO;
import org.kfokam48.stagemanagementbackend.dto.administrateur.AdministrateurUpdateDTO;
import org.kfokam48.stagemanagementbackend.enums.Roles;
import org.kfokam48.stagemanagementbackend.exception.ResourceAlreadyExistException;
import org.kfokam48.stagemanagementbackend.exception.RessourceNotFoundException;
import org.kfokam48.stagemanagementbackend.mapper.AdministrateurMappeur;
import org.kfokam48.stagemanagementbackend.model.Administrateur;
import org.kfokam48.stagemanagementbackend.repository.AdministrateurRepository;
import org.kfokam48.stagemanagementbackend.repository.UtilisateurRepository;
import org.kfokam48.stagemanagementbackend.service.AdministrateurService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class AdministrateurServiceImpl implements AdministrateurService {
    private final AdministrateurRepository administrateurRepository;
    private final AdministrateurMappeur administrateurMappeur;
    private final UtilisateurRepository utilisateurRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();


    public AdministrateurServiceImpl(AdministrateurRepository administrateurRepository, AdministrateurMappeur administrateurMappeur, UtilisateurRepository utilisateurRepository) {
        this.administrateurRepository = administrateurRepository;
        this.administrateurMappeur = administrateurMappeur;
        this.utilisateurRepository = utilisateurRepository;
    }

    @Override
    public AdministrateurResponseDTO getAdministrateurById(Long id) {
        Administrateur administrateur = administrateurRepository.findById(id)
                .orElseThrow(() -> new RessourceNotFoundException("Administrateur not found"));
        return  administrateurMappeur.administrateurToAdministareurReponseDTO(administrateur);
    }

    @Override
    public AdministrateurResponseDTO createAdministrateur(AdministrateurDTO administrateurDTO) {
        if (utilisateurRepository.existsByEmail(administrateurDTO.getEmail())) {
            throw new RessourceNotFoundException("User already exists with this email");
        }

        Administrateur administrateur = administrateurMappeur.adminsitrateurDTOToAdministrateur(administrateurDTO);
        administrateur.setRole(Roles.ADMIN);
        administrateur.setPassword(passwordEncoder.encode(administrateurDTO.getPassword()));
        administrateurRepository.save(administrateur);
        return administrateurMappeur.administrateurToAdministareurReponseDTO(administrateur);
    }

    @Override
    public AdministrateurResponseDTO updateAdministrateur(Long id, AdministrateurUpdateDTO administrateurUpdateDTO) {
        Administrateur administrateur = administrateurRepository.findById(id)
                .orElseThrow(() -> new RessourceNotFoundException("Administrateur not found"));

        if(administrateurUpdateDTO.getEmail() != null && !administrateurUpdateDTO.getEmail().equals(administrateur.getEmail())) {
            if (utilisateurRepository.existsByEmail(administrateurUpdateDTO.getEmail())) {
                throw new ResourceAlreadyExistException("User already exists with this email");
            }
        }

        administrateur.setEmail(administrateurUpdateDTO.getEmail());
        administrateur.setFullName(administrateurUpdateDTO.getFullName());
        administrateur.setPassword(passwordEncoder.encode(administrateurUpdateDTO.getPassword()));
        administrateur.setTelephone(administrateurUpdateDTO.getTelephone());
        administrateur.setAvatar(administrateurUpdateDTO.getAvatar());
        administrateur.setRole(Roles.ADMIN);
        administrateurRepository.save(administrateur);

        //administrateur = administrateurMappeur.administrateurUpdateDTOToAdministrateur(administrateurUpdateDTO);
        return administrateurMappeur.administrateurToAdministareurReponseDTO(administrateur);


    }

    @Override
    public ResponseEntity<String> deleteAdministrateur(Long id) {
        Administrateur administrateur = administrateurRepository.findById(id)
                .orElseThrow(() -> new RessourceNotFoundException("Administrateur not found"));
        administrateurRepository.delete(administrateur);
        return ResponseEntity.ok("Administrateur deleted successfully");
    }

    @Override
    public List<AdministrateurResponseDTO> getAllAdministrateurs() {
        return administrateurMappeur.administrateurListToAdministrateurResponseDTOList(administrateurRepository.findAll());
    }
}
