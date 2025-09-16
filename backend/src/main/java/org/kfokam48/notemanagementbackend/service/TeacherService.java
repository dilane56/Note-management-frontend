package org.kfokam48.notemanagementbackend.service;

import java.util.List;

import org.kfokam48.notemanagementbackend.dto.classes.ClassResponseDTO;
import org.kfokam48.notemanagementbackend.dto.teacher.TeacherClassDTO;
import org.kfokam48.notemanagementbackend.dto.teacher.TeacherDTO;
import org.kfokam48.notemanagementbackend.dto.teacher.TeacherResponseDTO;

public interface TeacherService {
    public TeacherResponseDTO getTeacherById(Long id);
    public List<TeacherResponseDTO> getTeachers();
    public TeacherResponseDTO createTeacher(TeacherDTO teacherDTO);
    public TeacherResponseDTO updateTeacher(Long id, TeacherDTO teacherDTO);
    public String deleteTeacher(Long id);
    public List<ClassResponseDTO> getTeacherClasses(Long id);
    public TeacherResponseDTO addTeacherSubject(Long id, Long subjectId);
    
}
