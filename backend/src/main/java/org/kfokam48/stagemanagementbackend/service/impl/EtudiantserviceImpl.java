package org.kfokam48.stagemanagementbackend.service.impl;

import org.kfokam48.stagemanagementbackend.dto.etudiant.EtudiantDTO;
import org.kfokam48.stagemanagementbackend.dto.etudiant.EtudiantResponseDTO;
import org.kfokam48.stagemanagementbackend.dto.etudiant.EtudiantUpdateDTO;
import org.kfokam48.stagemanagementbackend.enums.Roles;
import org.kfokam48.stagemanagementbackend.exception.RessourceNotFoundException;
import org.kfokam48.stagemanagementbackend.mapper.EtudiantMapper;
import org.kfokam48.stagemanagementbackend.model.Enseignant;
import org.kfokam48.stagemanagementbackend.model.Etudiant;
import org.kfokam48.stagemanagementbackend.model.embeded.Profile;
import org.kfokam48.stagemanagementbackend.repository.EnseignantRepository;
import org.kfokam48.stagemanagementbackend.repository.EtudiantRepository;
import org.kfokam48.stagemanagementbackend.repository.UtilisateurRepository;
import org.kfokam48.stagemanagementbackend.service.Etudiantservice;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class EtudiantserviceImpl implements Etudiantservice {
    private final EtudiantRepository etudiantRepository;
    private final EtudiantMapper etudiantMapper;
    private final UtilisateurRepository utilisateurRepository;
    private final EnseignantRepository enseignantRepository;
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    public EtudiantserviceImpl(EtudiantRepository etudiantRepository, EtudiantMapper etudiantMapper, UtilisateurRepository utilisateurRepository, EnseignantRepository enseignantRepository) {
        this.etudiantRepository = etudiantRepository;
        this.etudiantMapper = etudiantMapper;
        this.utilisateurRepository = utilisateurRepository;
        this.enseignantRepository = enseignantRepository;
    }

    @Override
    public EtudiantResponseDTO createEtudiant(EtudiantDTO etudiantDTO) {
        if (utilisateurRepository.existsByEmail(etudiantDTO.getEmail())) {
            throw new RuntimeException("User already exists with this email");
        }
        Etudiant etudiant = etudiantMapper.etudiantDtoToEtudiant(etudiantDTO);
        etudiant.setRole(Roles.ETUDIANT);
        etudiant.setPassword(passwordEncoder().encode(etudiantDTO.getPassword()));
        
        // Remplir le Profile avec les informations spécifiques à l'étudiant
        Profile profile = new Profile();
        profile.setFiliere(etudiant.getFiliere());
        profile.setAnneeScolaire(etudiant.getAnneeScolaire());
        profile.setNiveau(etudiant.getNiveau());
        profile.setUniversite(etudiant.getUniversite());
        etudiant.setProfile(profile);
        etudiant.setCreateAt(LocalDate.now());
        return etudiantMapper.etudiantToEtudiantResponseDTO(etudiantRepository.save(etudiant));
    }

    @Override
    public EtudiantResponseDTO getEtudiantById(Long id) {
       Etudiant etudiant = etudiantRepository.findById(id)
                .orElseThrow(() -> new RessourceNotFoundException("Etudiant not found"));
        return etudiantMapper.etudiantToEtudiantResponseDTO(etudiant);
    }

    @Override
    public List<EtudiantResponseDTO> getAllEtudiants() {
        return etudiantMapper.etudiantsToEtudiantResponseDTOs(etudiantRepository.findAll());
    }

    @Override
    public List<EtudiantResponseDTO> getEtudiantsByEnseignant(Long enseignantId) {
        Enseignant enseignant = enseignantRepository.findById(enseignantId)
                .orElseThrow(() -> new RessourceNotFoundException("Enseignant introuvable avec l'ID: " + enseignantId));
        
        List<Etudiant> etudiants = etudiantRepository.findByFiliere(enseignant.getFiliere());
        return etudiantMapper.etudiantsToEtudiantResponseDTOs(etudiants);
    }

    @Override
    public EtudiantResponseDTO updateEtudiant(Long id, EtudiantDTO etudiantDTO) {
        Etudiant etudiant = etudiantRepository.findById(id)
                .orElseThrow(() -> new RessourceNotFoundException("Etudiant not found"));
        if (etudiantDTO.getEmail() != null && !etudiantDTO.getEmail().equals(etudiant.getEmail())) {
            if (utilisateurRepository.existsByEmail(etudiantDTO.getEmail())) {
                throw new RessourceNotFoundException("User already exists with this email");
            }
        }
        etudiant.setRole(Roles.ETUDIANT);
        etudiant.setEmail(etudiantDTO.getEmail());
        etudiant.setFullName(etudiantDTO.getFullName());
        etudiant.setTelephone(etudiantDTO.getTelephone());
        etudiant.setAvatar(etudiantDTO.getAvatar());
        etudiant.setAnneeScolaire(etudiantDTO.getAnneeScolaire());
        etudiant.setFiliere(etudiantDTO.getFiliere());
        etudiant.setNiveau(etudiantDTO.getNiveau());
        etudiant.setUniversite(etudiantDTO.getUniversite());
        etudiant.setPassword(passwordEncoder().encode(etudiantDTO.getPassword()));
        etudiant.setUpdateAt(LocalDate.now());
        
        // Mettre à jour le Profile
        Profile profile = etudiant.getProfile() != null ? etudiant.getProfile() : new Profile();
        profile.setFiliere(etudiant.getFiliere());
        profile.setAnneeScolaire(etudiant.getAnneeScolaire());
        profile.setNiveau(etudiant.getNiveau());
        profile.setUniversite(etudiant.getUniversite());
        etudiant.setProfile(profile);
        etudiantRepository.save(etudiant);
        return etudiantMapper.etudiantToEtudiantResponseDTO(etudiant);
    }

    @Override
    public ResponseEntity<String> deleteEtudiant(Long id) {
        Etudiant etudiant = etudiantRepository.findById(id)
                .orElseThrow(() -> new RessourceNotFoundException("Etudiant not found"));
        etudiantRepository.delete(etudiant);
        return ResponseEntity.ok("Etudiant deleted successfully");
    }
}
