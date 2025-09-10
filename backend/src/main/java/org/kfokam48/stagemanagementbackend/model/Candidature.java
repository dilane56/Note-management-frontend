package org.kfokam48.stagemanagementbackend.model;

import jakarta.persistence.*;
import lombok.Data;
import org.kfokam48.stagemanagementbackend.enums.StatutCandidature;

import java.time.LocalDate;

@Data
@Entity
public class Candidature {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "etudiant_id")
    private Etudiant etudiant;

    @ManyToOne
    @JoinColumn(name = "offrestage_id")
    private OffreStage offreStage;

    @Enumerated(EnumType.STRING)
    private StatutCandidature statut; // ENUM : EN_ATTENTE, ACCEPTE, REFUSE

    private String lettreMotivation; // Texte riche
    private LocalDate dateReponse;
    private String messageReponse;
    private LocalDate dateCandidature;
    @Column(length = 500) // ✅ Définit une limite de 500 caractères
    private String cvPath;
}
