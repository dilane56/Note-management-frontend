package org.kfokam48.notemanagementbackend.mapper;

import org.kfokam48.notemanagementbackend.dto.admin.AdminDTO;
import org.kfokam48.notemanagementbackend.dto.admin.AdminResponseDTO;
import org.kfokam48.notemanagementbackend.model.Admin;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AdminMapper {
    private final ModelMapper modelMapper;

    public AdminMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }
    public Admin adminDTOToAdmin(AdminDTO adminDTO) {
        return modelMapper.map(adminDTO, Admin.class);
    }
    public AdminResponseDTO adminToAdminResponseDTO(Admin admin) {
        return modelMapper.map(admin, AdminResponseDTO.class);
    }

    public List<AdminResponseDTO> adminListToAdminResponseDTOList(List<Admin> adminList) {
        return adminList.stream()
                .map(this::adminToAdminResponseDTO)
                .toList();
    }
}
