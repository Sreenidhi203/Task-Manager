package com.taskflow.user.mapper;

import com.taskflow.user.dto.request.CreateUserRequest;
import com.taskflow.user.dto.response.UserResponse;
import com.taskflow.user.entity.Role;
import com.taskflow.user.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getRole().name(),
                user.isActive(),
                user.getCreatedAt()
        );
    }

    public User toEntity(CreateUserRequest req) {
        return User.builder()
                .username(req.getUsername())
                .email(req.getEmail())
                .fullName(req.getFullName())
                .role(parseRole(req.getRole()))
                .active(true)
                .build();
    }

    public Role parseRole(String role) {
        if (role == null || role.isBlank()) return Role.EMPLOYEE;
        try {
            return Role.valueOf(role.toUpperCase());
        } catch (IllegalArgumentException e) {
            return Role.EMPLOYEE;
        }
    }
}
