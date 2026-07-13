package com.example.taskmanager.ai;

/**
 * Contract for every AI backend.
 *
 * To plug in a real AI API (e.g. AWS Bedrock, Anthropic, Cohere):
 *   1. Create a new class that implements this interface.
 *   2. Annotate it with @Service and @Profile("ai") (or @ConditionalOnProperty).
 *   3. Annotate MockAiProvider with @Profile("mock") so Spring picks the right one.
 *   No other code needs to change.
 */
public interface AiProvider {
    SummarizeResponse summarize(SummarizeRequest request);
    SuggestPriorityResponse suggestPriority(SuggestPriorityRequest request);
    GenerateDescriptionResponse generateDescription(GenerateDescriptionRequest request);
}
