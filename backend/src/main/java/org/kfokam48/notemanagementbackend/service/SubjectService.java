package org.kfokam48.notemanagementbackend.service;

import java.util.List;
import org.kfokam48.notemanagementbackend.dto.subject.SubjectRequestDTO;
import org.kfokam48.notemanagementbackend.dto.subject.SubjectResponseDTO;

public interface SubjectService {
    public SubjectResponseDTO getSubjectById(Long id);
    public List<SubjectResponseDTO> getSubjects();
    public SubjectResponseDTO createSubject(SubjectRequestDTO subjectRequestDTO);
    public SubjectResponseDTO updateSubject(Long id, SubjectRequestDTO subjectRequestDTO);
    public String deleteSubject(Long id);
    public SubjectResponseDTO updateSubjectCoefficient(Long id, double coefficient);
  
}
