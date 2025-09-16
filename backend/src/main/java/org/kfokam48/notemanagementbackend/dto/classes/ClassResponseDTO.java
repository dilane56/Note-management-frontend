package org.kfokam48.notemanagementbackend.dto.classes;

import lombok.Data;

import java.util.List;
@Data
public class ClassResponseDTO {
    private Long id;
    private String className;
    private Long filiereId;
    private String FiliereName;
    private List<StudentInClassDTo> students;
}
