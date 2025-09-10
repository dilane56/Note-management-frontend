package org.kfokam48.stagemanagementbackend.dto.reports;

import lombok.Data;

@Data
public class CompanyPartnersDTO {
    private Long id;
    private String fullName;
    private String email;
    private String domaineActivite;
    private String siteWeb;
    private Long totalOffres;
    private Long totalCandidatures;
}