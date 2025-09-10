package org.kfokam48.stagemanagementbackend.dto.secteur;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SecteurRequestDTO {
    @NotNull(message = "Le nom du secteur ne peut pas être vide")
    @NotBlank(message = "Le nom du secteur ne peut pas être vide")
    private String nomSecteur;
}
