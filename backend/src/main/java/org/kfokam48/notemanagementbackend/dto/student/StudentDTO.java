package org.kfokam48.notemanagementbackend.dto.student;

import lombok.Data;
import org.kfokam48.notemanagementbackend.dto.user.UserDTO;
@Data
public class StudentDTO extends UserDTO {
    private Long studentClassId;
}
