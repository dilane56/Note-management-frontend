package org.kfokam48.notemanagementbackend.service;

import java.util.List;

import org.kfokam48.notemanagementbackend.dto.grade.GradeResponseDTO;
import org.kfokam48.notemanagementbackend.dto.student.StudentDTO;
import org.kfokam48.notemanagementbackend.dto.student.StudentResponseDTO;

public interface StudentService {
    public StudentResponseDTO getStudentById(Long id);
    public List<StudentResponseDTO> getStudents();
    public StudentResponseDTO createStudent(StudentDTO studentDTO);
    public StudentResponseDTO updateStudent(Long id, StudentDTO studentDTO);
    public String deleteStudent(Long id);
    public List<GradeResponseDTO> getGradesBySubject(Long subjectId);

}
