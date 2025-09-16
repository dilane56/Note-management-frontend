package org.kfokam48.notemanagementbackend.dto.transcript;


import lombok.Data;

@Data
public class GradeInTranscriptDTO {
    private Long id;
    private double noteValue;
    private String comment;
    private String subjectName;



}
