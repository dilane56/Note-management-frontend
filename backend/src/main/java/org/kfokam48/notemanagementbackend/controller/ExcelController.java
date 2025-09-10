package org.kfokam48.notemanagementbackend.controller;

import org.kfokam48.notemanagementbackend.dto.grade.GradeResponseDTO;
import org.kfokam48.notemanagementbackend.service.GradeService;
import org.kfokam48.notemanagementbackend.service.excel.ExcelService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

public class ExcelController {
    private final GradeService gradeService;
    private final ExcelService excelService;

    public ExcelController(GradeService gradeService, ExcelService excelService) {
        this.gradeService = gradeService;
        this.excelService = excelService;
    }

    @GetMapping("/students/{id}/export-excel")
    public ResponseEntity<byte[]> exportStudentGradesToExcel(@PathVariable Long id) {
        List<GradeResponseDTO> grades = gradeService.getGradesByStudentId(id);
        byte[] excelData = excelService.exportGradesToExcel(grades);

        return ResponseEntity.ok()
                .header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                .header("Content-Disposition", "attachment; filename=grades.xlsx")
                .body(excelData);
    }
}
