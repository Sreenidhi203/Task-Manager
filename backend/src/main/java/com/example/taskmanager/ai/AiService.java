package com.example.taskmanager.ai;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * Orchestration layer between the REST controller and the AI provider.
 * Add pre/post processing here (e.g. content sanitisation, caching,
 * audit logging) without touching the controller or the provider.
 */
@Service
@RequiredArgsConstructor
public class AiService {

    private final AiProvider aiProvider;

    public SummarizeResponse summarize(SummarizeRequest request) {
        return aiProvider.summarize(request);
    }

    public SuggestPriorityResponse suggestPriority(SuggestPriorityRequest request) {
        return aiProvider.suggestPriority(request);
    }

    public GenerateDescriptionResponse generateDescription(GenerateDescriptionRequest request) {
        return aiProvider.generateDescription(request);
    }
}
