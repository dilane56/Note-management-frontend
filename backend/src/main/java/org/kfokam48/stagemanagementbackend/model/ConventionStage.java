package org.kfokam48.stagemanagementbackend.model;

import jakarta.persistence.*;
import lombok.Data;
import org.kfokam48.stagemanagementbackend.enums.StatutCandidature;
import org.kfokam48.stagemanagementbackend.enums.StatutConvention;

import java.time.LocalDate;

@Data
@Entity
public class ConventionStage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "candidature_id", nullable = false)
    private Candidature candidature;

    @ManyToOne
    @JoinColumn(name = "enseignant_id" , nullable = true)
    private Enseignant enseignantValideur;

    @ManyToOne
    @JoinColumn(name = "administrateur_id", nullable = true)
    private Administrateur aprouvalAdministrator;
    @Column(length = 500)
    private StatutConvention statutConvention;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private LocalDate dateCreation;

    private LocalDate DateValidation;
    private LocalDate DateAprouval;
    private String commentaire;



}

