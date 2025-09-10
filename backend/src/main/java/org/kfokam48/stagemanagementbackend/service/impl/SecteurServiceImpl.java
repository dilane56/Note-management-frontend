package org.kfokam48.stagemanagementbackend.service.impl;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.kfokam48.stagemanagementbackend.dto.secteur.SecteurRequestDTO;
import org.kfokam48.stagemanagementbackend.exception.RessourceNotFoundException;
import org.kfokam48.stagemanagementbackend.mapper.SecteurMapper;
import org.kfokam48.stagemanagementbackend.model.Secteur;
import org.kfokam48.stagemanagementbackend.repository.SecteurRepository;
import org.kfokam48.stagemanagementbackend.service.SecteurService;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@Transactional
public class SecteurServiceImpl implements SecteurService {
    private final SecteurRepository secteurRepository;
    private final SecteurMapper secteurMapper;

    public SecteurServiceImpl(SecteurRepository secteurRepository, SecteurMapper secteurMapper) {
        this.secteurRepository = secteurRepository;
        this.secteurMapper = secteurMapper;
    }

    @Override
    public Secteur getSecteurById(Long id) {
        return secteurRepository.findById(id).orElseThrow(() -> new RessourceNotFoundException("Secteur not found"));
    }

    @Override
    public List<Secteur> getAllSecteurs() {
        return secteurRepository.findAll();
    }

    @Override
    public Secteur saveSecteur( @Valid SecteurRequestDTO secteurRequestDTO) {

        return secteurRepository.save(secteurMapper.secteurRequestDTOToSecteur(secteurRequestDTO));
    }

    @Override
    public String deleteSecteur(Long id) {
        Secteur secteur = secteurRepository.findById(id).orElseThrow(() -> new RessourceNotFoundException("Secteur not found"));
        secteurRepository.delete(secteur);
        return "Secteur deleted Successfully";
    }

    @Override
    public Secteur updateSecteur(Long id,@Valid SecteurRequestDTO secteurRequestDTO) {
        Secteur secteur = secteurRepository.findById(id).orElseThrow(() -> new RessourceNotFoundException("Secteur not found"));
        secteur.setNomSecteur(secteurRequestDTO.getNomSecteur());
        secteurRepository.save(secteur);
        return secteur;
    }
}
