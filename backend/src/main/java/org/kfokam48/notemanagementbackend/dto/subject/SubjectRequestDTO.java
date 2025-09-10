package org.kfokam48.notemanagementbackend.dto.subject;

import lombok.Data;

import java.util.List;
@Data
public class SubjectRequestDTO {
    private String name;
    private int noteMaximale;
    private double coefficient;
    private Long classId; // Classe concernée
    //private List<Long> teacherIds;


}
