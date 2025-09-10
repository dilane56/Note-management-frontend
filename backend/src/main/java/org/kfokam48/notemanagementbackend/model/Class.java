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
public class Class {
    @Id
    @GeneratedValue
    private Long id;
    private String className;
    @ManyToOne
    private Filiere filiere; // Ajout de la filière à laquelle la classe appartient
    @OneToMany(mappedBy = "studentClass")
    private List<Student> students= new ArrayList<>();

}


