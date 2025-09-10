package org.kfokam48.stagemanagementbackend.model.embeded;

import jakarta.persistence.Embeddable;
import lombok.Data;

@Data
@Embeddable
public class Profile {
    private String filiere;
    private String anneeScolaire;
    private String niveau;
    private String universite;
    private String domaineActivite;
    private String siteWeb;
    private String description;
    private String dateCreation;
}
