package org.kfokam48.notemanagementbackend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Subject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private int noteMaximale;
    private double coefficient;
    @ManyToMany
    private  List<Teacher> teachers=new ArrayList<>();
    @ManyToOne
    @JoinColumn(name = "subject_class_id")
    private Class subjectClass;

    // Getters, Setters & Constructors
}


