package org.kfokam48.stagemanagementbackend.service;

import org.kfokam48.stagemanagementbackend.dto.secteur.SecteurRequestDTO;
import org.kfokam48.stagemanagementbackend.model.Secteur;

import java.util.List;

public interface SecteurService {
    public Secteur getSecteurById(Long id);
    public List<Secteur> getAllSecteurs();
    public Secteur saveSecteur(SecteurRequestDTO secteurRequestDTO);
    public String deleteSecteur(Long id);
    public Secteur updateSecteur(Long id,SecteurRequestDTO secteurRequestDTO);
}
