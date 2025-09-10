package org.kfokam48.notemanagementbackend.service.impl;

import jakarta.transaction.Transactional;
import org.kfokam48.notemanagementbackend.dto.subject.SubjectRequestDTO;
import org.kfokam48.notemanagementbackend.dto.subject.SubjectResponseDTO;
import org.kfokam48.notemanagementbackend.exception.RessourceNotFoundException;
import org.kfokam48.notemanagementbackend.mapper.SubjectMapper;
import org.kfokam48.notemanagementbackend.model.Subject;
import org.kfokam48.notemanagementbackend.repository.ClassRepository;
import org.kfokam48.notemanagementbackend.repository.SubjectRepository;
import org.kfokam48.notemanagementbackend.service.SubjectService;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@Transactional
public class SubjectServiceImpl implements SubjectService {
    private final SubjectRepository subjectRepository;
    private final SubjectMapper subjectMapper;
    private final ClassRepository classRepository;

    public SubjectServiceImpl(SubjectRepository subjectRepository, SubjectMapper subjectMapper, ClassRepository classRepository) {
        this.subjectRepository = subjectRepository;
        this.subjectMapper = subjectMapper;
        this.classRepository = classRepository;
    }

    @Override
    public SubjectResponseDTO getSubjectById(Long id) {
        Subject subject = subjectRepository.findById(id).orElseThrow(() -> new RessourceNotFoundException("Subject not found"));
        return subjectMapper.subjectToSubjectResponseDTO(subject);
    }

    @Override
    public List<SubjectResponseDTO> getSubjects() {
        return subjectMapper.subjectToSubjectResponseDTOList(subjectRepository.findAll());
    }

    @Override
    public SubjectResponseDTO createSubject(SubjectRequestDTO subjectRequestDTO) {
        return subjectMapper.subjectToSubjectResponseDTO(subjectRepository.save(subjectMapper.subjectRequestDTOToSubject(subjectRequestDTO)));
    }

    @Override
    public SubjectResponseDTO updateSubject(Long id, SubjectRequestDTO subjectRequestDTO) {
        Subject subject = subjectRepository.findById(id).orElseThrow(() -> new RessourceNotFoundException("Subject not found"));
        subject.setCoefficient(subjectRequestDTO.getCoefficient());
        subject.setName(subjectRequestDTO.getName());
        subject.setSubjectClass(classRepository.findById(subjectRequestDTO.getClassId()).orElseThrow(() -> new RessourceNotFoundException("Class not found")));
        subjectRepository.save(subject);
        return subjectMapper.subjectToSubjectResponseDTO(subject);


    }

    @Override
    public String deleteSubject(Long id) {
        Subject subject = subjectRepository.findById(id).orElseThrow(() -> new RessourceNotFoundException("Subject not found"));
        subjectRepository.delete(subject);
        return "Subject deleted Successfully";
    }

    @Override
    public SubjectResponseDTO updateSubjectCoefficient(Long id, double coefficient) {
        Subject subject = subjectRepository.findById(id).orElseThrow(() -> new RessourceNotFoundException("Subject not found"));
        subject.setCoefficient(coefficient);
       return subjectMapper.subjectToSubjectResponseDTO(subjectRepository.save(subject));

    }
}
