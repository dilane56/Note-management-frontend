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
public class Teacher extends User {
    @ManyToMany(mappedBy = "teachers")
    private List<Subject> subjects = new ArrayList<>();

    @Transient // Ne pas stocker en base, mais calculer dynamiquement
    private List<Class> classes = new ArrayList<>();

    @PostLoad
    public void updateClasses() {
        classes = new ArrayList<>();
        for (Subject subject : subjects) {
            if (subject.getSubjectClass() != null && !classes.contains(subject.getSubjectClass())) {
                classes.add(subject.getSubjectClass());
            }
        }
    }



}

