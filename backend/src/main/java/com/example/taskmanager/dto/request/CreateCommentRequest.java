package com.example.taskmanager.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateCommentRequest {

    @NotNull(message = "Task ID is required")
    private Long taskId;

    @NotBlank(message = "Comment content is required")
    @Size(max = 4000, message = "Comment content must not exceed 4000 characters")
    private String content;
}
