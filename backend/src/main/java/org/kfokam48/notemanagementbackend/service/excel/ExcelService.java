package org.kfokam48.notemanagementbackend.service.excel;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.kfokam48.notemanagementbackend.dto.grade.GradeResponseDTO;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
public class ExcelService {

    public byte[] exportGradesToExcel(List<GradeResponseDTO> grades) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Notes");
            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("Matière");
            header.createCell(1).setCellValue("Note");

            int rowNum = 1;
            for (GradeResponseDTO grade : grades) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(grade.getSubjectName());
                row.createCell(1).setCellValue(grade.getNoteValue());
            }

            workbook.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de l'export Excel", e);
        }
    }
}
