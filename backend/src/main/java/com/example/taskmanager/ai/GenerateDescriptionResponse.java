package com.example.taskmanager.ai;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class GenerateDescriptionResponse {
    private String description;
    private String provider;
}
