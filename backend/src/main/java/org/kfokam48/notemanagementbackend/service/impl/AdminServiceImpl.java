package org.kfokam48.notemanagementbackend.service.impl;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.kfokam48.notemanagementbackend.dto.admin.AdminDTO;
import org.kfokam48.notemanagementbackend.dto.admin.AdminResponseDTO;
import org.kfokam48.notemanagementbackend.enums.Roles;
import org.kfokam48.notemanagementbackend.exception.RessourceNotFoundException;
import org.kfokam48.notemanagementbackend.mapper.AdminMapper;
import org.kfokam48.notemanagementbackend.model.Admin;
import org.kfokam48.notemanagementbackend.repository.AdminRepository;
import org.kfokam48.notemanagementbackend.service.AdminService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@Transactional
public class AdminServiceImpl implements AdminService {
    private final AdminRepository adminRepository;
    private final AdminMapper adminMapper;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AdminServiceImpl(AdminRepository adminRepository, AdminMapper adminMapper) {
        this.adminRepository = adminRepository;
        this.adminMapper = adminMapper;
    }


    @Override
    public List<AdminResponseDTO> getAllAdmins() {
        return adminMapper.adminListToAdminResponseDTOList(adminRepository.findAll());
    }

    @Override
    public AdminResponseDTO getAdminById(Long id) {
        Admin admin = adminRepository.findById(id).orElseThrow(() -> new RessourceNotFoundException("No admin found"));
        return adminMapper.adminToAdminResponseDTO(admin);
    }

    @Override
    public AdminResponseDTO createAdmin(@Valid AdminDTO adminDTO) {
        if (adminRepository.existsByEmail(adminDTO.getEmail())) {
            throw new RessourceNotFoundException("Email already exists");
        }
        Admin admin = adminMapper.adminDTOToAdmin(adminDTO);
        admin.setRole(Roles.ADMIN);
        admin.setPassword(passwordEncoder.encode(adminDTO.getPassword()));
        adminRepository.save(admin);
        return adminMapper.adminToAdminResponseDTO(admin);
    }

    @Override
    public AdminResponseDTO updateAdmin(AdminDTO adminDTO, Long id) {
        Admin admin = adminRepository.findById(id).orElseThrow(() -> new RessourceNotFoundException("No admin found"));
        admin.setEmail(adminDTO.getEmail());
        admin.setFirstName(adminDTO.getFirstName());
        admin.setLastName(adminDTO.getLastName());
        admin.setPassword(passwordEncoder.encode(adminDTO.getPassword()));
        adminRepository.save(admin);
        return null;
    }

    @Override
    public String deleteAdmin(Long id) {
        Admin admin = adminRepository.findById(id).orElseThrow(() -> new RessourceNotFoundException("No admin found"));
        adminRepository.delete(admin);
        return "Admin deleted Successfully";
    }
}
