package org.kfokam48.notemanagementbackend.mapper;

import org.kfokam48.notemanagementbackend.dto.teacher.TeacherClassDTO;
import org.kfokam48.notemanagementbackend.dto.teacher.TeacherDTO;
import org.kfokam48.notemanagementbackend.dto.teacher.TeacherResponseDTO;
import org.kfokam48.notemanagementbackend.dto.teacher.TeacherSubject;
import org.kfokam48.notemanagementbackend.enums.Roles;
import org.kfokam48.notemanagementbackend.model.Class;
import org.kfokam48.notemanagementbackend.model.Subject;
import org.kfokam48.notemanagementbackend.model.Teacher;
import org.kfokam48.notemanagementbackend.repository.ClassRepository;
import org.kfokam48.notemanagementbackend.repository.SubjectRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class TeacherMapper {
    private final ModelMapper modelMapper;
    private final SubjectRepository subjectRepository;
    private final ClassRepository classRepository;

    public TeacherMapper(ModelMapper modelMapper, SubjectRepository subjectRepository, ClassRepository classRepository) {
        this.modelMapper = modelMapper;
        this.subjectRepository = subjectRepository;
        this.classRepository = classRepository;
    }
    public Teacher teacherDTOToTeacher(TeacherDTO teacherDTO) {
       return modelMapper.map(teacherDTO, Teacher.class);
    }
    public TeacherResponseDTO teacherToTeacherResponseDTO(Teacher teacher) {
        TeacherResponseDTO teacherResponseDTO = new TeacherResponseDTO();
        teacherResponseDTO.setId(teacher.getId());
        teacherResponseDTO.setFirstName(teacher.getFirstName());
        teacherResponseDTO.setLastName(teacher.getLastName());
        teacherResponseDTO.setEmail(teacher.getEmail());
        teacherResponseDTO.setRole(Roles.TEACHER);
        List<TeacherSubject> teacherSubjects = new ArrayList<>(subjectToteacherSubjects(teacher.getSubjects()));
        teacherResponseDTO.setTeacherSubjects(teacherSubjects);
        return teacherResponseDTO;

    }

    public TeacherSubject teacherToteacherSubject(Subject subject) {
        TeacherSubject teacherSubject =new TeacherSubject();
        teacherSubject.setSubjectName(subject.getName());
        teacherSubject.setClasseName(subject.getSubjectClass().getClassName());
        return teacherSubject;
    }
    public List<TeacherSubject> subjectToteacherSubjects(List<Subject> subjects) {
        List<TeacherSubject> teacherSubjects = new ArrayList<TeacherSubject>();
        for (Subject subject : subjects) {
            teacherSubjects.add(teacherToteacherSubject(subject));
        }
        return teacherSubjects;
    }

    public List<TeacherResponseDTO> teacherToteacherResponseDTOs(List<Teacher> teachers) {
        List<TeacherResponseDTO> teacherResponseDTOList = new ArrayList<>();
        for (Teacher teacher : teachers) {
            teacherResponseDTOList.add(teacherToTeacherResponseDTO(teacher));
        }
        return teacherResponseDTOList;
    }

    public List<Class> getClassFromSubjects(List<Subject> subjects) {
        List<Class> classes = new ArrayList<>();
        for (Subject subject : subjects) {
            classes.add(subject.getSubjectClass());
        }
        return classes;
    }

    public TeacherClassDTO classToTeacherClassDTO(Class clazz) {
        TeacherClassDTO teacherClassDTO = new TeacherClassDTO();
        teacherClassDTO.setClassName(clazz.getClassName());
        teacherClassDTO.setFiliereName(clazz.getFiliere().getName());
        return teacherClassDTO;

    }

    public List<TeacherClassDTO> classToTeacherClassDTOs(List<Class> classes) {
        List<TeacherClassDTO> teacherClassDTOList = new ArrayList<>();
        for (Class clazz : classes) {
            teacherClassDTOList.add(classToTeacherClassDTO(clazz));
        }
        return teacherClassDTOList;
    }

    public List<TeacherClassDTO> getTeacherClassFromSubjects(List<Subject> subjects) {
        List<TeacherClassDTO> classes = new ArrayList<>();
        for (Subject subject : subjects) {
            classes.add(classToTeacherClassDTO(subject.getSubjectClass()));
        }
        return classes;
    }


}
