package com.example.taskmanager.ai;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SummarizeResponse {
    private String summary;
    private int inputTokenEstimate;
    private String provider;
}
