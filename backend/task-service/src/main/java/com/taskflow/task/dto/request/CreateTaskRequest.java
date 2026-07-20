package com.taskflow.task.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateTaskRequest {
    @NotBlank @Size(max = 255)
    private String title;
    private String description;
    @NotNull
    private Long projectId;
    private Long assigneeId;
    private String status;
    private String priority;
    private LocalDate dueDate;
}
