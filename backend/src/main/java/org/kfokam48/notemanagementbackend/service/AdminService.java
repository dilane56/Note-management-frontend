package org.kfokam48.notemanagementbackend.service;

import org.kfokam48.notemanagementbackend.dto.admin.AdminDTO;
import org.kfokam48.notemanagementbackend.dto.admin.AdminResponseDTO;

import java.util.List;

public interface AdminService {
    public List<AdminResponseDTO> getAllAdmins();
    public AdminResponseDTO getAdminById(Long id);
    public AdminResponseDTO createAdmin(AdminDTO adminDTO);
    public AdminResponseDTO updateAdmin(AdminDTO adminDTO, Long id);
    public String deleteAdmin(Long id);
}
