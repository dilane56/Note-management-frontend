package org.kfokam48.notemanagementbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;
@Data
@AllArgsConstructor
public class ChartDataDTO {
    private List<String> labels;  // Noms des matières
    private List<Double> data;    // Notes obtenues

    // Getters, Setters & Constructors
}
