package org.kfokam48.notemanagementbackend.service.impl;
import jakarta.transaction.Transactional;
import org.kfokam48.notemanagementbackend.dto.ChartDataDTO;
import org.kfokam48.notemanagementbackend.model.Grade;
import org.kfokam48.notemanagementbackend.repository.GradeRepository;
import org.kfokam48.notemanagementbackend.service.ChartService;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;



    @Service
    @Transactional
    public class ChartServiceImpl implements ChartService {

        private final GradeRepository gradeRepository;

        public ChartServiceImpl(GradeRepository gradeRepository) {
            this.gradeRepository = gradeRepository;
        }

        @Override
        public ChartDataDTO getChartDataForStudent(Long studentId) {
            List<Grade> grades = gradeRepository.findByStudentId(studentId);

            List<String> labels = grades.stream()
                    .map(grade -> grade.getSubject().getName())
                    .collect(Collectors.toList());

            List<Double> data = grades.stream()
                    .map(Grade::getValue)
                    .collect(Collectors.toList());

            return new ChartDataDTO(labels, data);
        }
    }

