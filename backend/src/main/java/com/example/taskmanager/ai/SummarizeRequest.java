package com.example.taskmanager.ai;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SummarizeRequest {

    @NotBlank(message = "Content to summarize is required")
    @Size(max = 10000, message = "Content must not exceed 10 000 characters")
    private String content;

    /** Optional hint: "task", "project", "comment" */
    private String contextType;
}
