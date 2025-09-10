package org.kfokam48.notemanagementbackend.dto.teacher;

import lombok.Data;
import org.kfokam48.notemanagementbackend.dto.user.UserResponseDTO;

import java.util.List;
@Data
public class TeacherResponseDTO extends UserResponseDTO {

    private List<TeacherSubject> teacherSubjects;

}
