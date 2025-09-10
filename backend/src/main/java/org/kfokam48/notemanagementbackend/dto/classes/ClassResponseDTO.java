package org.kfokam48.notemanagementbackend.dto.classes;

import lombok.Data;

import java.util.List;
@Data
public class ClassResponseDTO {
    private Long id;
    private String className;
    private String FiliereName;
    private Long filiereId;
    private List<StudentInClassDTo> students;
}
