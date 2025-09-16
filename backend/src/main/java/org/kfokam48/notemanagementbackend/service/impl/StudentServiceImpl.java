package org.kfokam48.notemanagementbackend.service.impl;

import jakarta.transaction.Transactional;
import org.kfokam48.notemanagementbackend.dto.grade.GradeResponseDTO;
import org.kfokam48.notemanagementbackend.dto.student.StudentDTO;
import org.kfokam48.notemanagementbackend.dto.student.StudentResponseDTO;
import org.kfokam48.notemanagementbackend.dto.student.StudentRankingDTO;
import org.kfokam48.notemanagementbackend.enums.Roles;
import org.kfokam48.notemanagementbackend.exception.RessourceNotFoundException;
import org.kfokam48.notemanagementbackend.mapper.StudentMapper;
import org.kfokam48.notemanagementbackend.model.Grade;
import org.kfokam48.notemanagementbackend.model.Student;
import org.kfokam48.notemanagementbackend.repository.ClassRepository;
import org.kfokam48.notemanagementbackend.repository.GradeRepository;
import org.kfokam48.notemanagementbackend.repository.StudentRepository;
import org.kfokam48.notemanagementbackend.service.StudentService;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@Transactional
public class StudentServiceImpl implements StudentService {
    private final StudentRepository studentRepository;
    private final StudentMapper studentMapper;
    private final ClassRepository classRepository;
    private final GradeRepository gradeRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public StudentServiceImpl(StudentRepository studentRepository, StudentMapper studentMapper, ClassRepository classRepository, GradeRepository gradeRepository) {
        this.studentRepository = studentRepository;
        this.studentMapper = studentMapper;
        this.classRepository = classRepository;
        this.gradeRepository = gradeRepository;
    }


    @Override
    public StudentResponseDTO getStudentById(Long id) {
        Student student = studentRepository.findById(id).orElseThrow(()->new RessourceNotFoundException("Student not found"));
        return studentMapper.studentTOStudentResponseDTO(student);
    }

    @Override
    public List<StudentResponseDTO> getStudents() {
        return studentMapper.studentListToStudentResponseDTO(studentRepository.findAll());
    }

    @Override
    public StudentResponseDTO createStudent(StudentDTO studentDTO) {
       Student student = studentMapper.studentDTOToStudent(studentDTO);
       student.setPassword(passwordEncoder.encode(student.getPassword()));
       student.setRole(Roles.STUDENT);
       return studentMapper.studentTOStudentResponseDTO(studentRepository.save(student));
    }

    @Override
    public StudentResponseDTO updateStudent(Long id, StudentDTO studentDTO) {
        Student student = studentRepository.findById(id).orElseThrow(()->new RessourceNotFoundException("Student not found"));
        student.setStudentClass(classRepository.findById(studentDTO.getStudentClassId()).orElseThrow(()->new RessourceNotFoundException("Student not found")));
        student.setFirstName(studentDTO.getFirstName());
        student.setLastName(studentDTO.getLastName());
        student.setEmail(studentDTO.getEmail());
        student.setPassword(passwordEncoder.encode(studentDTO.getPassword()));
        studentRepository.save(student);
       return studentMapper.studentTOStudentResponseDTO(student);
    }

    @Override
    public String deleteStudent(Long id) {
        Student student = studentRepository.findById(id).orElseThrow(()->new RessourceNotFoundException("Student not found"));
        studentRepository.delete(student);
        return "Student deleted Successfully";
    }

    @Override
    public List<GradeResponseDTO> getGradesBySubject(Long subjectId) {
        return List.of();
    }

    @Override
    public StudentRankingDTO getStudentRanking(Long studentId) {
        Student student = studentRepository.findById(studentId)
            .orElseThrow(() -> new RessourceNotFoundException("Student not found"));
        
        List<Grade> studentGrades = gradeRepository.findByStudentId(studentId);
        double studentAverage = studentGrades.stream().mapToDouble(Grade::getValue).average().orElse(0.0);
        
        List<Student> classmates = studentRepository.findByStudentClassId(student.getStudentClass().getId());
        
        List<Double> classAverages = classmates.stream()
            .map(s -> gradeRepository.findByStudentId(s.getId()).stream()
                .mapToDouble(Grade::getValue).average().orElse(0.0))
            .sorted((a, b) -> Double.compare(b, a))
            .toList();
        
        int rank = classAverages.indexOf(studentAverage) + 1;
        double classAverage = classAverages.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
        
        return new StudentRankingDTO(rank, classmates.size(), classAverage, studentAverage);
    }


}
