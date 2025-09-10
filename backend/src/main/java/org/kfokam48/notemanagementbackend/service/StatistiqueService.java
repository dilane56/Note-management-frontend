package org.kfokam48.notemanagementbackend.service;

import org.kfokam48.notemanagementbackend.dto.SuccessRateDTO;
import org.kfokam48.notemanagementbackend.model.Grade;
import org.kfokam48.notemanagementbackend.model.Student;
import org.kfokam48.notemanagementbackend.repository.GradeRepository;
import org.kfokam48.notemanagementbackend.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StatistiqueService {
    private final StudentRepository studentRepository;
    private final GradeRepository gradeRepository;

    public StatistiqueService(StudentRepository studentRepository, GradeRepository gradeRepository) {
        this.studentRepository = studentRepository;
        this.gradeRepository = gradeRepository;
    }

//    public SuccessRateDTO getGlobalSuccessRate() {
//        List<Student> students = studentRepository.findAll();
//        int totalStudents = students.size();
//        int successfulStudents = (int) students.stream()
//                .filter(student -> student.getTranscripts().getAverage() >= 10)
//                .count();
//
//        double successRate = (double) successfulStudents / totalStudents * 100;
//
//        return new SuccessRateDTO(successRate, totalStudents, successfulStudents);
//    }

    public double calculateStudentAverage(Long studentId) {
        List<Grade> grades = gradeRepository.findByStudentId(studentId);
        double totalWeightedScore = 0;
        double totalCoefficient = 0;

        for (Grade grade : grades) {
            totalWeightedScore += grade.getValue() * grade.getSubject().getCoefficient();
            totalCoefficient += grade.getSubject().getCoefficient();
        }

        return totalCoefficient == 0 ? 0 : totalWeightedScore / totalCoefficient;
    }

}
