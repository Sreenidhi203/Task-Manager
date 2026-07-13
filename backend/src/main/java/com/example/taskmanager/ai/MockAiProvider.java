package com.example.taskmanager.ai;

import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Random;

/**
 * Mock AI provider — no external calls, no API keys required.
 *
 * Replacement guide:
 *   1. Create RealAiProvider implements AiProvider (e.g. backed by AWS Bedrock).
 *   2. Annotate this class with @Profile("mock").
 *   3. Annotate RealAiProvider with @Profile("!mock") or @ConditionalOnProperty.
 *   4. Set spring.profiles.active=mock in application.yml for local dev.
 */
@Component
public class MockAiProvider implements AiProvider {

    private static final String PROVIDER_NAME = "mock";
    private static final Random RNG = new Random();

    // ── Summarize ────────────────────────────────────────────────────────────

    @Override
    public SummarizeResponse summarize(SummarizeRequest request) {
        String content = request.getContent();
        int wordCount = content.split("\\s+").length;

        String summary = buildSummary(content, request.getContextType());
        int tokenEstimate = (int) Math.ceil(wordCount * 1.3);

        return new SummarizeResponse(summary, tokenEstimate, PROVIDER_NAME);
    }

    private String buildSummary(String content, String contextType) {
        String[] sentences = content.split("[.!?]+");
        if (sentences.length == 0) return content;

        String first = sentences[0].trim();
        String type = contextType != null ? contextType : "item";

        return String.format(
                "This %s covers: %s. Key points include task ownership, deadlines, and deliverable scope.",
                type, first.length() > 80 ? first.substring(0, 80) + "…" : first
        );
    }

    // ── Suggest Priority ─────────────────────────────────────────────────────

    private static final List<String> URGENT_KEYWORDS =
            List.of("urgent", "critical", "asap", "blocker", "production", "outage", "security");
    private static final List<String> HIGH_KEYWORDS =
            List.of("important", "deadline", "release", "launch", "client", "customer");
    private static final List<String> LOW_KEYWORDS =
            List.of("nice to have", "optional", "minor", "cleanup", "refactor", "docs");

    @Override
    public SuggestPriorityResponse suggestPriority(SuggestPriorityRequest request) {
        String combined = ((request.getTitle() == null ? "" : request.getTitle()) + " "
                + (request.getDescription() == null ? "" : request.getDescription())).toLowerCase();

        boolean dueSoon = isDueSoon(request.getDueDate(), 3);
        boolean dueThisWeek = isDueSoon(request.getDueDate(), 7);

        String priority;
        double confidence;
        String reasoning;

        if (containsAny(combined, URGENT_KEYWORDS) || dueSoon) {
            priority = "URGENT";
            confidence = 0.91;
            reasoning = dueSoon
                    ? "Due date is within 3 days — immediate attention required."
                    : "Title or description contains urgency indicators.";
        } else if (containsAny(combined, HIGH_KEYWORDS) || dueThisWeek) {
            priority = "HIGH";
            confidence = 0.78;
            reasoning = dueThisWeek
                    ? "Due date is within the next 7 days."
                    : "Content references client-facing or release-related work.";
        } else if (containsAny(combined, LOW_KEYWORDS)) {
            priority = "LOW";
            confidence = 0.72;
            reasoning = "Content suggests non-critical, housekeeping work.";
        } else {
            priority = "MEDIUM";
            confidence = 0.60 + RNG.nextDouble() * 0.15;
            reasoning = "No strong urgency or low-priority signals detected; defaulting to medium.";
        }

        return new SuggestPriorityResponse(priority, round(confidence), reasoning, PROVIDER_NAME);
    }

    private boolean isDueSoon(String dueDateStr, int withinDays) {
        if (dueDateStr == null || dueDateStr.isBlank()) return false;
        try {
            LocalDate due = LocalDate.parse(dueDateStr);
            LocalDate now = LocalDate.now();
            return !due.isBefore(now) && due.isBefore(now.plusDays(withinDays));
        } catch (DateTimeParseException e) {
            return false;
        }
    }

    private boolean containsAny(String text, List<String> keywords) {
        return keywords.stream().anyMatch(text::contains);
    }

    // ── Generate Description ─────────────────────────────────────────────────

    private static final List<String> TASK_TEMPLATES = List.of(
            "Implement %s by identifying requirements, designing the solution, and delivering tested, documented code.",
            "Complete %s ensuring all acceptance criteria are met, edge cases are handled, and the team is notified upon completion.",
            "Deliver %s with a focus on quality, performance, and alignment with project standards."
    );

    private static final List<String> PROJECT_TEMPLATES = List.of(
            "%s aims to deliver measurable business value through structured planning, cross-team collaboration, and iterative delivery.",
            "%s will be executed in phases, with clear milestones, stakeholder reviews, and a defined definition of done.",
            "The goal of %s is to improve operational efficiency, reduce risk, and meet the agreed-upon success criteria."
    );

    @Override
    public GenerateDescriptionResponse generateDescription(GenerateDescriptionRequest request) {
        String title = request.getTitle();
        boolean isProject = "project".equalsIgnoreCase(request.getContextType());

        List<String> templates = isProject ? PROJECT_TEMPLATES : TASK_TEMPLATES;
        String template = templates.get(RNG.nextInt(templates.size()));
        String base = String.format(template, title);

        String description = request.getHints() != null && !request.getHints().isBlank()
                ? base + " Additional context: " + request.getHints().trim() + "."
                : base;

        return new GenerateDescriptionResponse(description, PROVIDER_NAME);
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}
