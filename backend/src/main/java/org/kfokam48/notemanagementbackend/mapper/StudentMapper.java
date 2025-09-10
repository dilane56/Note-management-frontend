package org.kfokam48.notemanagementbackend.mapper;

import org.kfokam48.notemanagementbackend.dto.student.ClassInStudentDTO;
import org.kfokam48.notemanagementbackend.dto.student.NoteInStudentDTO;
import org.kfokam48.notemanagementbackend.dto.student.StudentDTO;
import org.kfokam48.notemanagementbackend.dto.student.StudentResponseDTO;
import org.kfokam48.notemanagementbackend.exception.RessourceNotFoundException;
import org.kfokam48.notemanagementbackend.model.Class;
import org.kfokam48.notemanagementbackend.model.Grade;
import org.kfokam48.notemanagementbackend.model.Student;
import org.kfokam48.notemanagementbackend.repository.ClassRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class StudentMapper {
    private final ModelMapper modelMapper;
    private final ClassRepository classRepository;
    private final EvaluationMapper evaluationMapper;

    public StudentMapper(ModelMapper modelMapper, ClassRepository classRepository, EvaluationMapper evaluationMapper) {
        this.modelMapper = modelMapper;
        this.classRepository = classRepository;
        this.evaluationMapper = evaluationMapper;
    }
    public Student studentDTOToStudent(StudentDTO studentDTO) {
        Student student= new Student();
        student.setFirstName(studentDTO.getFirstName());
        student.setLastName(studentDTO.getLastName());
        student.setEmail(studentDTO.getEmail());
        student.setPassword(studentDTO.getPassword());
        student.setStudentClass(classRepository.findById(studentDTO.getStudentClassId()).orElseThrow(()->new RessourceNotFoundException("Student class not found")));
        return student;
    }

    public StudentResponseDTO studentTOStudentResponseDTO(Student student) {
        StudentResponseDTO studentResponseDTO = modelMapper.map(student, StudentResponseDTO.class);
        studentResponseDTO.setStudentClass(classToclassInStudentDTO(student.getStudentClass()));
        studentResponseDTO.setNotes(gradeToNoteInStudentDTO(student.getGrades()));
        return studentResponseDTO;
    }

    public ClassInStudentDTO classToclassInStudentDTO(Class classe) {
        ClassInStudentDTO classInStudentDTO = new ClassInStudentDTO();
        classInStudentDTO.setClassName(classe.getClassName());
        classInStudentDTO.setFiliereName(classe.getFiliere().getName());
        return classInStudentDTO;
    }
    public NoteInStudentDTO noteToNoteInStudentDTO(Grade note) {
        NoteInStudentDTO noteInStudentDTO = new NoteInStudentDTO();
        noteInStudentDTO.setNoteValue(note.getValue());
        noteInStudentDTO.setComment(note.getComment());
        noteInStudentDTO.setSubjectName(note.getSubject().getName());
        noteInStudentDTO.setSubjectCoefficient(noteInStudentDTO.getSubjectCoefficient());
        return noteInStudentDTO;

    }
    public List<NoteInStudentDTO> gradeToNoteInStudentDTO(List<Grade> grades) {
        List<NoteInStudentDTO> noteInStudentDTOs = new ArrayList<>();
        for (Grade grade : grades) {
            noteInStudentDTOs.add(noteToNoteInStudentDTO(grade));
        }
        return noteInStudentDTOs;
    }

    public List<StudentResponseDTO> studentListToStudentResponseDTO(List<Student> students) {
        List<StudentResponseDTO> studentResponseDTOs = new ArrayList<>();
        for (Student student : students) {
            studentResponseDTOs.add(studentTOStudentResponseDTO(student));
        }
        return studentResponseDTOs;
    }
}
