package com.example.taskmanager.ai;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GenerateDescriptionRequest {

    @NotBlank(message = "Title is required to generate a description")
    @Size(max = 255)
    private String title;

    /** Optional keywords or bullet points to guide generation */
    @Size(max = 1000)
    private String hints;

    /** "task" or "project" — shapes the tone of the output */
    private String contextType;
}
