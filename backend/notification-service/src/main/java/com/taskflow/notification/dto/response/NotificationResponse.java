package com.taskflow.notification.dto.response;

import java.time.Instant;

public record NotificationResponse(
        Long id,
        Long userId,
        String title,
        String message,
        String type,
        boolean read,
        Instant createdAt
) {}
