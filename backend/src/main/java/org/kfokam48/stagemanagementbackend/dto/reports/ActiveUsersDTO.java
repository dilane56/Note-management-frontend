package org.kfokam48.stagemanagementbackend.dto.reports;

import lombok.Data;
import org.kfokam48.stagemanagementbackend.enums.Roles;

import java.time.Instant;

@Data
public class ActiveUsersDTO {
    private Long id;
    private String fullName;
    private String email;
    private Roles role;
    private Instant derniereConnexion;
    private String status;
}