package org.kfokam48.notemanagementbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public  class SuccessRateDTO {
    private double suceesRate;
    private int totalOfStudets;
    private int successfullStudents;
}
