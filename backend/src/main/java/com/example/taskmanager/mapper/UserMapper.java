package com.example.taskmanager.mapper;

import com.example.taskmanager.dto.request.CreateUserRequest;
import com.example.taskmanager.dto.request.UpdateUserRequest;
import com.example.taskmanager.dto.response.UserResponse;
import com.example.taskmanager.entity.Role;
import com.example.taskmanager.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponse toResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());
        response.setRole(user.getRole().name());
        response.setActive(user.isActive());
        return response;
    }

    public User toEntity(CreateUserRequest request, String encodedPassword) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(encodedPassword);
        user.setFullName(request.getFullName());
        user.setRole(parseRole(request.getRole()));
        user.setActive(request.getActive() != null ? request.getActive() : true);
        return user;
    }

    public void updateEntity(User user, UpdateUserRequest request, String encodedPassword) {
        if (request.getUsername() != null && !request.getUsername().isBlank()) {
            user.setUsername(request.getUsername());
        }
        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            user.setEmail(request.getEmail());
        }
        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }
        if (request.getRole() != null && !request.getRole().isBlank()) {
            user.setRole(parseRole(request.getRole()));
        }
        if (request.getActive() != null) {
            user.setActive(request.getActive());
        }
        if (encodedPassword != null) {
            user.setPassword(encodedPassword);
        }
    }

    private Role parseRole(String role) {
        if (role == null || role.isBlank()) {
            return Role.EMPLOYEE;
        }
        return switch (role.toUpperCase()) {
            case "ADMIN" -> Role.ADMIN;
            case "MANAGER" -> Role.MANAGER;
            default -> Role.EMPLOYEE;
        };
    }
}
