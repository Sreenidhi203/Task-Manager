package com.example.taskmanager.ai;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SuggestPriorityResponse {

    /** One of: LOW, MEDIUM, HIGH, URGENT */
    private String suggestedPriority;

    /** 0.0 – 1.0 confidence score */
    private double confidence;

    private String reasoning;
    private String provider;
}
