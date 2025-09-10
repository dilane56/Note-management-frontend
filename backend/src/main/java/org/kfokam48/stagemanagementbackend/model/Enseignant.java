package org.kfokam48.stagemanagementbackend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import lombok.Data;

@Data
@Entity
@PrimaryKeyJoinColumn(name = "utilisateur_id")
public class Enseignant extends Utilisateur {
    private String filiere;
    private String grade;
    private String departement;
    private String universite;





}

