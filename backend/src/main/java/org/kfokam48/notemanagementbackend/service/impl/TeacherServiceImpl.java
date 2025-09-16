package org.kfokam48.notemanagementbackend.service.impl;

import jakarta.transaction.Transactional;
import org.kfokam48.notemanagementbackend.dto.classes.ClassResponseDTO;
import org.kfokam48.notemanagementbackend.dto.subject.SubjectResponseDTO;
import org.kfokam48.notemanagementbackend.dto.teacher.TeacherClassDTO;
import org.kfokam48.notemanagementbackend.dto.teacher.TeacherDTO;
import org.kfokam48.notemanagementbackend.dto.teacher.TeacherResponseDTO;
import org.kfokam48.notemanagementbackend.enums.Roles;
import org.kfokam48.notemanagementbackend.exception.RessourceNotFoundException;
import org.kfokam48.notemanagementbackend.mapper.ClassMapper;
import org.kfokam48.notemanagementbackend.mapper.SubjectMapper;
import org.kfokam48.notemanagementbackend.mapper.TeacherMapper;
import org.kfokam48.notemanagementbackend.model.Subject;
import org.kfokam48.notemanagementbackend.model.Teacher;
import org.kfokam48.notemanagementbackend.repository.SubjectRepository;
import org.kfokam48.notemanagementbackend.repository.TeacherRepository;
import org.kfokam48.notemanagementbackend.service.TeacherService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
@Service
@Transactional
public class TeacherServiceImpl implements TeacherService {
    private final TeacherRepository teacherRepository;
    private final TeacherMapper teacherMapper;
    private final SubjectRepository subjectRepository;
    private final SubjectMapper subjectMapper;
    private final ClassMapper classMapper;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public TeacherServiceImpl(TeacherRepository teacherRepository, TeacherMapper teacherMapper, SubjectRepository subjectRepository, SubjectMapper subjectMapper, ClassMapper classMapper) {
        this.teacherRepository = teacherRepository;
        this.teacherMapper = teacherMapper;
        this.subjectRepository = subjectRepository;
        this.subjectMapper = subjectMapper;
        this.classMapper = classMapper;
    }

    @Override
    public TeacherResponseDTO getTeacherById(Long id) {
        Teacher teacher = teacherRepository.findById(id).orElseThrow(()->new RessourceNotFoundException("Teacher not found"));
        return teacherMapper.teacherToTeacherResponseDTO(teacher);
    }

    @Override
    public List<TeacherResponseDTO> getTeachers() {
        return teacherMapper.teacherToteacherResponseDTOs(teacherRepository.findAll());
    }

    @Override
    public TeacherResponseDTO createTeacher(TeacherDTO teacherDTO) {
        Teacher teacher = teacherMapper.teacherDTOToTeacher(teacherDTO);
        teacher.setRole(Roles.TEACHER);
        teacher.setPassword(passwordEncoder.encode(teacherDTO.getPassword()));
        teacherRepository.save(teacher);
        return teacherMapper.teacherToTeacherResponseDTO(teacher);
    }

    @Override
    public TeacherResponseDTO updateTeacher(Long id, TeacherDTO teacherDTO) {
        Teacher teacher = teacherRepository.findById(id).orElseThrow(()->new RessourceNotFoundException("Teacher not found"));
        teacher.setEmail(teacherDTO.getEmail());
        teacher.setFirstName(teacherDTO.getFirstName());
        teacher.setLastName(teacherDTO.getLastName());
        teacher.setRole(Roles.TEACHER);
        teacher.setPassword(passwordEncoder.encode(teacherDTO.getPassword()));
        teacherRepository.save(teacher);
        return teacherMapper.teacherToTeacherResponseDTO(teacher);
    }

    @Override
    public String deleteTeacher(Long id) {
        Teacher teacher = teacherRepository.findById(id).orElseThrow(()->new RessourceNotFoundException("Teacher not found"));
        teacherRepository.delete(teacher);
        return "Teacher deleted Successfully";
    }

    @Override
    public List<ClassResponseDTO> getTeacherClasses(Long id) {
        Teacher teacher = teacherRepository.findById(id).orElseThrow(()->new RessourceNotFoundException("Teacher not found"));
        return classMapper.classListToClassResponseDTOList(teacher.getClasses());

    }

    @Override
    public TeacherResponseDTO addTeacherSubject(Long id, Long subjectId) {
        Teacher teacher = teacherRepository.findById(id).orElseThrow(()->new RessourceNotFoundException("Teacher not found"));
        Subject subject = subjectRepository.findById(subjectId).orElseThrow(()->new RessourceNotFoundException("Subject not found"));
        List<Teacher> teachers = new ArrayList<>();
        teachers.add(teacher);
        subject.setTeachers(teachers);
        subjectRepository.save(subject);
        List<Subject> subjects = new ArrayList<>(teacher.getSubjects());
        subjects.add(subject);
        teacher.setSubjects(subjects);
        teacherRepository.save(teacher);
        return teacherMapper.teacherToTeacherResponseDTO(teacher);
    }

    public List<SubjectResponseDTO> getTeacherSubjects(Long teacherId) {
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new RessourceNotFoundException("Teacher not found"));
        return subjectMapper.subjectToSubjectResponseDTOList(teacher.getSubjects());
    }

    public SubjectResponseDTO updateSubjectCoefficient(Long teacherId, Long subjectId, double coefficient) {
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new RessourceNotFoundException("Teacher not found"));
        
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new RessourceNotFoundException("Subject not found"));
        
        if (!teacher.getSubjects().contains(subject)) {
            throw new RessourceNotFoundException("Subject not assigned to this teacher");
        }
        
        subject.setCoefficient(coefficient);
        subjectRepository.save(subject);
        
        return subjectMapper.subjectToSubjectResponseDTO(subject);
    }
}
