package org.kfokam48.notemanagementbackend.repository;

import org.kfokam48.notemanagementbackend.model.Grade;
import org.kfokam48.notemanagementbackend.model.Student;
import org.kfokam48.notemanagementbackend.model.Subject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudentRepository extends JpaRepository<Student, Long> {
    List<Student> findByStudentClassId(Long classId);

}
