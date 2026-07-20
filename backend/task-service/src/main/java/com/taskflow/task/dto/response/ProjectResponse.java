package com.taskflow.task.dto.response;

import java.time.Instant;

public record ProjectResponse(
        Long id,
        String name,
        String description,
        Long ownerId,
        String status,
        int taskCount,
        Instant createdAt,
        Instant updatedAt
) {}
