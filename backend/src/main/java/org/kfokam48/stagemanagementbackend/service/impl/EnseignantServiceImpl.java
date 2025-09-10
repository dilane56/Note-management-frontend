package org.kfokam48.stagemanagementbackend.service.impl;

import org.kfokam48.stagemanagementbackend.dto.enseigant.EnseignantDTO;
import org.kfokam48.stagemanagementbackend.dto.enseigant.EnseignantResponseDTO;
import org.kfokam48.stagemanagementbackend.dto.enseigant.EnseignantUpdateDTO;
import org.kfokam48.stagemanagementbackend.enums.Roles;
import org.kfokam48.stagemanagementbackend.exception.RessourceNotFoundException;
import org.kfokam48.stagemanagementbackend.mapper.EnseignantMapper;
import org.kfokam48.stagemanagementbackend.model.Enseignant;
import org.kfokam48.stagemanagementbackend.model.embeded.Profile;
import org.kfokam48.stagemanagementbackend.repository.EnseignantRepository;
import org.kfokam48.stagemanagementbackend.repository.UtilisateurRepository;
import org.kfokam48.stagemanagementbackend.service.EnseignantService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
@Service
@Transactional
public class EnseignantServiceImpl implements EnseignantService {
    private final EnseignantRepository enseignantRepository;
    private final EnseignantMapper enseignantMapper;
    private final UtilisateurRepository utilisateurRepository;
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    public EnseignantServiceImpl(EnseignantRepository enseignantRepository, EnseignantMapper enseignantMapper, UtilisateurRepository utilisateurRepository) {
        this.enseignantRepository = enseignantRepository;
        this.enseignantMapper = enseignantMapper;
        this.utilisateurRepository = utilisateurRepository;
    }

    @Override
    public EnseignantResponseDTO createEnseignant(EnseignantDTO enseignantDTO) {
        if (utilisateurRepository.existsByEmail(enseignantDTO.getEmail())) {
            throw new RessourceNotFoundException("User already exists with this email");
        }
        Enseignant enseignant = enseignantMapper.enseigantDTOToEnseignant(enseignantDTO);
        enseignant.setRole(Roles.ENSEIGNANT);
        enseignant.setPassword(passwordEncoder().encode(enseignantDTO.getPassword()));
        
        // Remplir le Profile avec les informations spécifiques à l'enseignant
        Profile profile = new Profile();
        profile.setUniversite(enseignant.getUniversite());
        enseignant.setProfile(profile);
        return enseignantMapper.enseignantToEnseignantResponseDTO(enseignantRepository.save(enseignant));
    }

    @Override
    public EnseignantResponseDTO getEnseignantById(Long id) {
        Enseignant enseignant = enseignantRepository.findById(id)
                .orElseThrow(() -> new RessourceNotFoundException("Enseignant not found"));
        return enseignantMapper.enseignantToEnseignantResponseDTO(enseignant);
    }

    @Override
    public List<EnseignantResponseDTO> getAllEnseignants() {
        return enseignantMapper.enseigantListToEnseigantResponseDTOs(enseignantRepository.findAll());
    }

    @Override
    public EnseignantResponseDTO updateEnseignant(Long id, EnseignantDTO enseignantDTO) {
        Enseignant enseignant = enseignantRepository.findById(id)
                .orElseThrow(() -> new RessourceNotFoundException("Enseignant not found"));
        if (enseignantDTO.getEmail() != null && !enseignantDTO.getEmail().equals(enseignant.getEmail())) {
            if (utilisateurRepository.existsByEmail(enseignantDTO.getEmail())) {
                throw new RessourceNotFoundException("User already exists with this email");
            }
            enseignant.setEmail(enseignantDTO.getEmail());
        }
        enseignant.setRole(Roles.ENSEIGNANT);
        enseignant.setFullName(enseignantDTO.getFullName());
        enseignant.setTelephone(enseignantDTO.getTelephone());
        enseignant.setAvatar(enseignantDTO.getAvatar());
        enseignant.setFiliere(enseignantDTO.getFiliere());
        enseignant.setGrade(enseignantDTO.getGrade());
        enseignant.setDepartement(enseignantDTO.getDepartement());
        enseignant.setUniversite(enseignantDTO.getUniversite());
        enseignant.setPassword(passwordEncoder().encode(enseignantDTO.getPassword()));
        enseignant.setUpdateAt(LocalDate.now());
        
        // Mettre à jour le Profile
        Profile profile = enseignant.getProfile() != null ? enseignant.getProfile() : new Profile();
        profile.setUniversite(enseignant.getUniversite());
        enseignant.setProfile(profile);
        
        enseignantRepository.save(enseignant);
        return enseignantMapper.enseignantToEnseignantResponseDTO(enseignant);
    }

    @Override
    public ResponseEntity<String> deleteEnseignant(Long id) {
        Enseignant enseignant = enseignantRepository.findById(id)
                .orElseThrow(() -> new RessourceNotFoundException("Enseignant not found"));
        enseignantRepository.delete(enseignant);
        return ResponseEntity.ok("Enseignant deleted successfully");
    }
}
