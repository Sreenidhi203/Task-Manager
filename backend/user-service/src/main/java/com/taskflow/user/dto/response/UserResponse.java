package com.taskflow.user.dto.response;

import java.time.Instant;

public record UserResponse(
        Long id,
        String username,
        String email,
        String fullName,
        String role,
        boolean active,
        Instant createdAt
) {}
