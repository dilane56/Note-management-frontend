package org.kfokam48.notemanagementbackend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.kfokam48.notemanagementbackend.enums.TypeEvaluation;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(
        name = "evaluations",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"type", "annee_academique"})
        }
)
public class Evaluation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeEvaluation type;

    @Column(name = "annee_academique", nullable = false)
    private String anneeAcademique;

}
