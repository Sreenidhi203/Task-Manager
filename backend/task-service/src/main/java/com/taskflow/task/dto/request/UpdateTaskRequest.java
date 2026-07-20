package com.taskflow.task.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateTaskRequest {
    @Size(max = 255)
    private String title;
    private String description;
    private Long assigneeId;
    private String status;
    private String priority;
    private LocalDate dueDate;
}
