package org.kfokam48.notemanagementbackend.mapper;

import org.kfokam48.notemanagementbackend.dto.user.UserDTO;
import org.kfokam48.notemanagementbackend.dto.user.UserResponseDTO;
import org.kfokam48.notemanagementbackend.model.User;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;


import java.util.List;

@Component
public class UserMapper {
    private final ModelMapper modelMapper;

    public UserMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    public User userDTOToUser(UserDTO userDTO) {
        return modelMapper.map(userDTO, User.class);
    }
    public UserResponseDTO userToUserResponseDTO(User user) {
        return modelMapper.map(user, UserResponseDTO.class);
    }

    public List<UserResponseDTO>  userListToUserResponseDTOList(List<User> userList) {
        return userList.stream().map(this::userToUserResponseDTO).toList();
    }
}
