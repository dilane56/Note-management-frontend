package org.kfokam48.stagemanagementbackend.model;
import jakarta.persistence.*;
import lombok.Data;
import org.kfokam48.stagemanagementbackend.enums.Roles;
import org.kfokam48.stagemanagementbackend.enums.UserStatus;
import org.kfokam48.stagemanagementbackend.model.embeded.Profile;

import java.time.Instant;
import java.time.LocalDate;

@Data
@Entity
@Inheritance(strategy = InheritanceType.JOINED) // Héritage pour les différents types d'utilisateurs
public abstract class Utilisateur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;
    private String fullName;
    private String telephone;
    private String avatar;
    private LocalDate createAt;
    private LocalDate updateAt;
    // La date et l'heure de la dernière connexion
    private Instant derniereConnexion;

    @Enumerated(EnumType.STRING)
    private Roles role;

    @Embedded
    private Profile profile;
    private UserStatus status;
}
