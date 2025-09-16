package org.kfokam48.notemanagementbackend.repository;

import org.kfokam48.notemanagementbackend.model.Subject;
import org.kfokam48.notemanagementbackend.model.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubjectRepository extends JpaRepository<Subject, Long> {
    List<Subject> findByTeachersContaining(Teacher teacher);
}
