package org.kfokam48.notemanagementbackend.service.impl;

import jakarta.transaction.Transactional;
import org.kfokam48.notemanagementbackend.dto.classes.ClassRequestDTO;
import org.kfokam48.notemanagementbackend.dto.classes.ClassResponseDTO;
import org.kfokam48.notemanagementbackend.exception.RessourceNotFoundException;
import org.kfokam48.notemanagementbackend.mapper.ClassMapper;
import org.kfokam48.notemanagementbackend.model.Class;
import org.kfokam48.notemanagementbackend.repository.ClassRepository;
import org.kfokam48.notemanagementbackend.repository.FiliereRepository;
import org.kfokam48.notemanagementbackend.service.ClassService;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@Transactional
public class ClassServiceImpl implements ClassService {
    private final ClassRepository classRepository;
    private final ClassMapper classMapper;
    private final FiliereRepository filiereRepository;

    public ClassServiceImpl(ClassRepository classRepository, ClassMapper classMapper, FiliereRepository filiereRepository) {
        this.classRepository = classRepository;
        this.classMapper = classMapper;
        this.filiereRepository = filiereRepository;
    }

    @Override
    public List<ClassResponseDTO> getAll() {
        return classMapper.classListToClassResponseDTOList(classRepository.findAll());
    }

    @Override
    public ClassResponseDTO getById(Long id) {
        Class classe = classRepository.findById(id).orElseThrow(() -> new RessourceNotFoundException("Class not found"));
        return classMapper.classToClassRequestDTO(classe);
    }

    @Override
    public ClassResponseDTO save(ClassRequestDTO classRequestDTO) {
        return classMapper.classToClassRequestDTO(classRepository.save(classMapper.classRequestDTOToClasse(classRequestDTO)));
    }

    @Override
    public ClassResponseDTO update(ClassRequestDTO classRequestDTO, Long id) {
        Class classe = classRepository.findById(id).orElseThrow(() -> new RessourceNotFoundException("Class not found"));
        classe.setClassName(classRequestDTO.getClassName());
        classe.setFiliere(filiereRepository.findById(classRequestDTO.getFiliereId()).orElseThrow(() -> new RessourceNotFoundException("Filiere not found")));
        classRepository.save(classe);
        return classMapper.classToClassRequestDTO(classe);
    }

    @Override
    public String deleteById(Long id) {
        Class classe = classRepository.findById(id).orElseThrow(() -> new RessourceNotFoundException("Class not found"));
        classRepository.delete(classe);
        return "Class successfully deleted";
    }
}
