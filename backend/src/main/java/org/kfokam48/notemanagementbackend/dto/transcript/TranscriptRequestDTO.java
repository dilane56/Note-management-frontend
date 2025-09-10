package org.kfokam48.notemanagementbackend.dto.transcript;

import lombok.Data;

@Data
public class TranscriptRequestDTO {

    private Long studentId;
    private Long evaluationId;
    private String academicYear;


}
