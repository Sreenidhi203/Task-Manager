package com.taskflow.task.dto.response;

import java.time.Instant;

public record CommentResponse(
        Long id,
        String content,
        Long taskId,
        Long authorId,
        String authorName,
        Instant createdAt,
        Instant updatedAt
) {}
