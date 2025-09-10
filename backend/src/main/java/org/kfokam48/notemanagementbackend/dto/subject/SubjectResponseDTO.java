package org.kfokam48.notemanagementbackend.dto.subject;

import lombok.Data;

import java.util.List;
@Data
public class SubjectResponseDTO {
    private Long id;
    private String name;
    private int noteMaximale;
    private double coefficient;
    private String className;
    private List<TeacherInSubjectDTO> teachers;


}
