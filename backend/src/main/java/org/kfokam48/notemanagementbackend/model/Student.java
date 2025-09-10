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
public class Student extends User {

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    private List<Transcript> transcripts = new ArrayList<>();

    @OneToMany(mappedBy = "student")
    private List<Grade> grades = new ArrayList<>();

    private String matricule;

    @ManyToOne
    private Class studentClass;
}

