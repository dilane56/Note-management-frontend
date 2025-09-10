package org.kfokam48.notemanagementbackend.repository;

import org.kfokam48.notemanagementbackend.model.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeacherRepository extends JpaRepository<Teacher, Long> {
}
