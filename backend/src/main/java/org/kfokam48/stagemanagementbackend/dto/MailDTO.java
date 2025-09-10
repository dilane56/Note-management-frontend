package org.kfokam48.stagemanagementbackend.dto;

import lombok.Data;

@Data
public class MailDTO {
    private String destinataireEmail;
    private String sujet;
    private String message;
}
