package com.taskflow.notification.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateNotificationRequest {
    @NotNull
    private Long userId;
    @NotBlank
    private String title;
    @NotBlank
    private String message;
    private String type;
}
