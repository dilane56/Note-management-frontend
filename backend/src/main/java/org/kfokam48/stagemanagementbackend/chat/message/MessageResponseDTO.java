package org.kfokam48.stagemanagementbackend.chat.message;

import lombok.Data;
import org.kfokam48.stagemanagementbackend.enums.MessageStatus;


import java.time.Instant;


@Data
public class MessageResponseDTO {

    private Long id;
    private Long expediteurId;
    private String expediteurFullName;
    private Long destinataireId;
    private String destinataireFullName;

    private String content;
    private Instant dateEnvoi; // Recommandé pour la gestion des fuseaux horaires
    private Boolean lu;
    private MessageStatus status; // Ajout pour un statut plus précis




}