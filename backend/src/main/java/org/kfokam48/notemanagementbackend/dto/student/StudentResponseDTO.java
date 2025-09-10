package org.kfokam48.notemanagementbackend.dto.student;

import lombok.Data;
import org.kfokam48.notemanagementbackend.dto.user.UserResponseDTO;

import java.util.List;

@Data
public class StudentResponseDTO  extends UserResponseDTO {
    private String matricule;
    private ClassInStudentDTO studentClass;
    private List<NoteInStudentDTO> notes;


}
