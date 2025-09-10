package org.kfokam48.notemanagementbackend.service;

import org.kfokam48.notemanagementbackend.dto.classes.ClassRequestDTO;
import org.kfokam48.notemanagementbackend.dto.classes.ClassResponseDTO;

import java.util.List;

public interface ClassService {
    public List<ClassResponseDTO> getAll();
    public ClassResponseDTO getById(Long id);
    public ClassResponseDTO save(ClassRequestDTO classRequestDTO);
    public ClassResponseDTO update(ClassRequestDTO classRequestDTO, Long id);
    public String deleteById(Long id);
}
