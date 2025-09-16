package org.kfokam48.notemanagementbackend.dto.subject;

import lombok.Data;

@Data
public class TeacherInSubjectDTO {
    private Long teacherId;
    private String teacherFirstName;
    private String teacherLastName;
}
