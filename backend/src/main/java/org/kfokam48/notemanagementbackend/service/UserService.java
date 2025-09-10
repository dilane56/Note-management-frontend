package org.kfokam48.notemanagementbackend.service;

import org.kfokam48.notemanagementbackend.dto.user.UserResponseDTO;

import java.util.List;

public interface UserService {
    public List<UserResponseDTO> getAllUsers();
    public UserResponseDTO getUserById(Long id);
    public String deleteUserById(Long id);
}
