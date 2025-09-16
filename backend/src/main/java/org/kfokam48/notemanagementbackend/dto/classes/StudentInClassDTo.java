package org.kfokam48.notemanagementbackend.dto.classes;

import lombok.Data;

@Data
public class StudentInClassDTo {
    private Long studentId;
    private String studentFirstName;
    private String studentLastName;
    private String studentMatricule;
}
