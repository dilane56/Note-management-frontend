package org.kfokam48.notemanagementbackend.mapper;

import org.kfokam48.notemanagementbackend.dto.classes.ClassRequestDTO;
import org.kfokam48.notemanagementbackend.dto.classes.ClassResponseDTO;
import org.kfokam48.notemanagementbackend.dto.classes.StudentInClassDTo;
import org.kfokam48.notemanagementbackend.model.Class;
import org.kfokam48.notemanagementbackend.model.Student;
import org.kfokam48.notemanagementbackend.repository.FiliereRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class ClassMapper {
    private ModelMapper modelMapper;
    private final FiliereRepository filiereRepository;

    public ClassMapper(ModelMapper modelMapper, FiliereRepository filiereRepository) {
        this.modelMapper = modelMapper;
        this.filiereRepository = filiereRepository;
    }
    public Class classRequestDTOToClasse(ClassRequestDTO classRequestDTO) {
        Class clazz = new Class();
        clazz.setClassName(classRequestDTO.getClassName());
        clazz.setFiliere(filiereRepository.findById(classRequestDTO.getFiliereId()).orElseThrow(() -> new RuntimeException("Filiere not found")));
        return clazz;
    }

    public ClassResponseDTO classToClassRequestDTO(Class clazz) {
        ClassResponseDTO classResponseDTO = modelMapper.map(clazz, ClassResponseDTO.class);
        classResponseDTO.setFiliereName(clazz.getFiliere().getName());
        classResponseDTO.setStudents(studentToStudentInClassDToList(clazz.getStudents()));
        return classResponseDTO;
    }
    public StudentInClassDTo studentToStudentInClassDTo(Student student) {
        StudentInClassDTo studentInClassDTo = new StudentInClassDTo();
        studentInClassDTo.setStudentMatricule(student.getMatricule());
        studentInClassDTo.setStudentFirstName(student.getFirstName());
        studentInClassDTo.setStudentLastName(student.getLastName());
        return studentInClassDTo;
    }

    public List<StudentInClassDTo> studentToStudentInClassDToList(List<Student> students) {
        List<StudentInClassDTo> studentInClassDToList = new ArrayList<>();
        for (Student student : students) {
            studentInClassDToList.add(studentToStudentInClassDTo(student));
        }
        return studentInClassDToList;
    }

    public List<ClassResponseDTO> classListToClassResponseDTOList(List<Class> classes) {
        List<ClassResponseDTO> classResponseDTOList = new ArrayList<>();
        for (Class clazz : classes) {
            classResponseDTOList.add(modelMapper.map(clazz, ClassResponseDTO.class));
        }
        return classResponseDTOList;
    }
}
