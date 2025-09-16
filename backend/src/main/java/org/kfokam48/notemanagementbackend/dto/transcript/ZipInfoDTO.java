package org.kfokam48.notemanagementbackend.dto.transcript;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ZipInfoDTO {
    private Long classId;
    private String className;
    private int totalFiles;
    private List<String> fileNames;
    private long estimatedSizeBytes;
    private LocalDateTime generatedAt;
    private String downloadUrl;
}