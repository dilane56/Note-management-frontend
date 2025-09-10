package org.kfokam48.notemanagementbackend.mapper;

import org.kfokam48.notemanagementbackend.dto.subject.SubjectRequestDTO;
import org.kfokam48.notemanagementbackend.dto.subject.SubjectResponseDTO;
import org.kfokam48.notemanagementbackend.dto.subject.TeacherInSubjectDTO;
import org.kfokam48.notemanagementbackend.exception.RessourceNotFoundException;
import org.kfokam48.notemanagementbackend.model.Subject;
import org.kfokam48.notemanagementbackend.model.Teacher;
import org.kfokam48.notemanagementbackend.repository.ClassRepository;
import org.kfokam48.notemanagementbackend.repository.TeacherRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
@Component
public class SubjectMapper {

    private final ModelMapper modelMapper;
    private final ClassRepository classRepository;
    private final TeacherRepository teacherRepository;

    public SubjectMapper(ModelMapper modelMapper, ClassRepository classRepository, TeacherRepository teacherRepository) {
        this.modelMapper = modelMapper;
        this.classRepository = classRepository;
        this.teacherRepository = teacherRepository;
    }
    public Subject subjectRequestDTOToSubject(SubjectRequestDTO subjectRequestDTO) {
        Subject subject =  new Subject();
        subject.setName(subjectRequestDTO.getName());
        subject.setCoefficient(subjectRequestDTO.getCoefficient());
        subject.setSubjectClass( classRepository.findById(subjectRequestDTO.getClassId()).orElseThrow(()->new RessourceNotFoundException("Class not found")));
        subject.setNoteMaximale(subjectRequestDTO.getNoteMaximale());
        return subject;

    }

    public SubjectResponseDTO subjectToSubjectResponseDTO(Subject subject) {
        SubjectResponseDTO subjectResponseDTO = modelMapper.map(subject, SubjectResponseDTO.class);
        subjectResponseDTO.setClassName(subject.getSubjectClass().getClassName());
        subjectResponseDTO.setTeachers(teacherToTeacherInSubjectDTOList(subject.getTeachers()));
        subjectResponseDTO.setNoteMaximale( subject.getNoteMaximale());
        return subjectResponseDTO;

    }

    public TeacherInSubjectDTO teacherToTeacherInSubjectDTO(Teacher teacher) {
        TeacherInSubjectDTO teacher1 = new TeacherInSubjectDTO();
        teacher1.setTeacherFirstName(teacher.getFirstName());
        teacher1.setTeacherLastName(teacher.getLastName());
        return teacher1;
    }
    public List<TeacherInSubjectDTO> teacherToTeacherInSubjectDTOList(List<Teacher> teachers) {
        List<TeacherInSubjectDTO> teacherInSubjectDTOList = new ArrayList<>();
        for (Teacher teacher : teachers) {
            teacherInSubjectDTOList.add(teacherToTeacherInSubjectDTO(teacher));
        }
        return teacherInSubjectDTOList;
    }

    public  List<SubjectResponseDTO> subjectToSubjectResponseDTOList(List<Subject> subjects) {
        List<SubjectResponseDTO> subjectResponseDTOList = new ArrayList<>();
        for (Subject subject : subjects) {
            subjectResponseDTOList.add(subjectToSubjectResponseDTO(subject));
        }
        return subjectResponseDTOList;
    }
}
