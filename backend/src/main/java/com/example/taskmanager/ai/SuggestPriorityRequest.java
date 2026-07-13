package com.example.taskmanager.ai;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SuggestPriorityRequest {

    @NotBlank(message = "Task title is required")
    @Size(max = 255)
    private String title;

    @Size(max = 2000)
    private String description;

    /** ISO-8601 date string, e.g. "2025-12-31" */
    private String dueDate;

    /** Current project name for additional context */
    private String projectName;
}
