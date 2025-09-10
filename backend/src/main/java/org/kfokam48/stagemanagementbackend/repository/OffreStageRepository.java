package org.kfokam48.stagemanagementbackend.repository;

import org.kfokam48.stagemanagementbackend.model.OffreStage;
import org.kfokam48.stagemanagementbackend.model.Secteur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OffreStageRepository extends JpaRepository<OffreStage, Long> {

    List<OffreStage> findByLocalisationContainingIgnoreCaseAndDureeStageAndSecteurNomSecteurContainingIgnoreCase(
            String localisation, Integer dureeStage, String secteurNom);
    List<OffreStage> findByLocalisationContainingIgnoreCase(String localisation);
    List<OffreStage> findByDureeStage(Integer dureeStage);
    List<OffreStage> findBySecteurNomSecteurContainingIgnoreCase(String secteurNom);
    List<OffreStage> findByLocalisationContainingIgnoreCaseAndDureeStage(String localisation, Integer dureeStage);
    List<OffreStage> findByLocalisationContainingIgnoreCaseAndSecteurNomSecteurContainingIgnoreCase(String localisation, String secteurNom);
    List<OffreStage> findByDureeStageAndSecteurNomSecteurContainingIgnoreCase(Integer dureeStage, String secteurNom);
    List<OffreStage> findOffreStageBySecteur(Secteur secteur);
    List<OffreStage> findByEntrepriseId(Long entrepriseId);
    Long countByEntrepriseId(Long entrepriseId);
}
