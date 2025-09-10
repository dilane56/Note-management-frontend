package org.kfokam48.stagemanagementbackend.dto.convention;

import lombok.Data;
import org.kfokam48.stagemanagementbackend.dto.candidature.CandidatureResponseDTO;
import org.kfokam48.stagemanagementbackend.enums.StatutConvention;

import java.time.LocalDate;

@Data
public class ConventionResponseDTO {
    private Long idConvention;
    private String enseignantName;
    private String administratorName;
    private StatutConvention statutConvention;
    private CandidatureResponseDTO candidature;
    private LocalDate DateCreation;
    private LocalDate DateDebut;
    private LocalDate DateFin;
    private LocalDate DateValidation;
    private LocalDate DateAprouval;
}
