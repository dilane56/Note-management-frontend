package org.kfokam48.notemanagementbackend.service.excel;

import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.kfokam48.notemanagementbackend.model.*;
import org.kfokam48.notemanagementbackend.repository.*;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExcelExportService {

    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final GradeRepository gradeRepository;
    private final TranscriptRepository transcriptRepository;

    public byte[] exportStudentsList(Long classId) throws IOException {
        List<Student> students = studentRepository.findByStudentClassId(classId);
        
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Liste des Étudiants");
            
            // En-têtes
            Row headerRow = sheet.createRow(0);
            CellStyle headerStyle = createHeaderStyle(workbook);
            
            String[] headers = {"ID", "Nom", "Prénom", "Email", "Date de Naissance", "Classe"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }
            
            // Données
            int rowNum = 1;
            for (Student student : students) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(student.getId());
                row.createCell(1).setCellValue(student.getLastName());
                row.createCell(2).setCellValue(student.getFirstName());
                row.createCell(3).setCellValue(student.getEmail());
                row.createCell(5).setCellValue(student.getClass().getName());
            }
            
            autoSizeColumns(sheet, headers.length);
            workbook.write(out);
            return out.toByteArray();
        }
    }

    public byte[] exportTeachersList() throws IOException {
        List<Teacher> teachers = teacherRepository.findAll();
        
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Liste des Enseignants");
            
            // En-têtes
            Row headerRow = sheet.createRow(0);
            CellStyle headerStyle = createHeaderStyle(workbook);
            
            String[] headers = {"ID", "Nom", "Prénom", "Email", "Spécialité"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }
            
            // Données
            int rowNum = 1;
            for (Teacher teacher : teachers) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(teacher.getId());
                row.createCell(1).setCellValue(teacher.getLastName());
                row.createCell(2).setCellValue(teacher.getFirstName());
                row.createCell(3).setCellValue(teacher.getEmail());
                List<Subject> subjects = teacher.getSubjects();
                row.createCell(4).setCellValue(subjects.get(0).getName());
            }
            
            autoSizeColumns(sheet, headers.length);
            workbook.write(out);
            return out.toByteArray();
        }
    }

    public byte[] exportClassStatistics(Long classId, Long evaluationId) throws IOException {
        List<Transcript> transcripts = transcriptRepository.findByStudent_StudentClass_IdAndEvaluationId(classId, evaluationId);
        List<Grade> grades = gradeRepository.findByStudent_StudentClass_IdAndEvaluation_Id(classId, evaluationId);
        
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            // Feuille des moyennes par étudiant
            createStudentAveragesSheet(workbook, transcripts);
            
            // Feuille des notes détaillées
            createDetailedGradesSheet(workbook, grades);
            
            workbook.write(out);
            return out.toByteArray();
        }
    }

    public byte[] exportCompleteClassData(Long classId, Long evaluationId) throws IOException {
        List<Student> students = studentRepository.findByStudentClassId(classId);
        List<Transcript> transcripts = transcriptRepository.findByStudent_StudentClass_IdAndEvaluationId(classId, evaluationId);
        List<Grade> grades = gradeRepository.findByStudent_StudentClass_IdAndEvaluation_Id(classId, evaluationId);
        
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            // Feuille des étudiants
            createStudentsSheet(workbook, students);
            
            // Feuille des moyennes par étudiant
            createStudentAveragesSheet(workbook, transcripts);
            
            // Feuille des notes détaillées
            createDetailedGradesSheet(workbook, grades);
            
            workbook.write(out);
            return out.toByteArray();
        }
    }

    private void createStudentsSheet(Workbook workbook, List<Student> students) {
        Sheet sheet = workbook.createSheet("Liste des Étudiants");
        
        Row headerRow = sheet.createRow(0);
        CellStyle headerStyle = createHeaderStyle(workbook);
        
        String[] headers = {"ID", "Nom", "Prénom", "Email", "Date de Naissance", "Classe"};
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }
        
        int rowNum = 1;
        for (Student student : students) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(student.getId());
            row.createCell(1).setCellValue(student.getLastName());
            row.createCell(2).setCellValue(student.getFirstName());
            row.createCell(3).setCellValue(student.getEmail());
            row.createCell(5).setCellValue(student.getClass().getName());
        }
        
        autoSizeColumns(sheet, headers.length);
    }

    private void createStudentAveragesSheet(Workbook workbook, List<Transcript> transcripts) {
        Sheet sheet = workbook.createSheet("Moyennes par Étudiant");
        
        Row headerRow = sheet.createRow(0);
        CellStyle headerStyle = createHeaderStyle(workbook);
        
        String[] headers = {"Rang", "Nom", "Prénom", "Moyenne", "Date de Génération"};
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }
        
        // Trier par moyenne décroissante
        transcripts.sort((t1, t2) -> Double.compare(t2.getAverage(), t1.getAverage()));
        
        int rowNum = 1;
        int rank = 1;
        for (Transcript transcript : transcripts) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(rank++);
            row.createCell(1).setCellValue(transcript.getStudent().getLastName());
            row.createCell(2).setCellValue(transcript.getStudent().getFirstName());
            row.createCell(3).setCellValue(transcript.getAverage());
            row.createCell(4).setCellValue(transcript.getGeneratedDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
        }
        
        autoSizeColumns(sheet, headers.length);
    }

    private void createDetailedGradesSheet(Workbook workbook, List<Grade> grades) {
        Sheet sheet = workbook.createSheet("Notes Détaillées");
        
        Row headerRow = sheet.createRow(0);
        CellStyle headerStyle = createHeaderStyle(workbook);
        
        String[] headers = {"Étudiant", "Matière", "Note", "Note Max", "Coefficient", "Commentaire"};
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }
        
        int rowNum = 1;
        for (Grade grade : grades) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(grade.getStudent().getLastName() + " " + grade.getStudent().getFirstName());
            row.createCell(1).setCellValue(grade.getSubject().getName());
            row.createCell(2).setCellValue(grade.getValue());
            row.createCell(3).setCellValue(grade.getSubject().getNoteMaximale());
            row.createCell(4).setCellValue(grade.getSubject().getCoefficient());
            row.createCell(5).setCellValue(grade.getComment() != null ? grade.getComment() : "");
        }
        
        autoSizeColumns(sheet, headers.length);
    }

    private CellStyle createHeaderStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setColor(IndexedColors.WHITE.getIndex());
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        return style;
    }

    private void autoSizeColumns(Sheet sheet, int columnCount) {
        for (int i = 0; i < columnCount; i++) {
            sheet.autoSizeColumn(i);
        }
    }
}