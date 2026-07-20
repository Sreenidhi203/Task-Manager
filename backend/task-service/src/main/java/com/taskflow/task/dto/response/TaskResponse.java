package com.taskflow.task.dto.response;

import java.time.Instant;
import java.time.LocalDate;

public record TaskResponse(
        Long id,
        String title,
        String description,
        Long projectId,
        String projectName,
        Long assigneeId,
        String status,
        String priority,
        LocalDate dueDate,
        int commentCount,
        Instant createdAt,
        Instant updatedAt
) {}
