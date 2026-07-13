package com.example.taskmanager.ai;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Tag(name = "AI Assistant", description = "AI-powered summarisation, priority suggestion, and description generation")
public class AiController {

    private final AiService aiService;

    @Operation(
            summary = "Summarize content",
            description = "Returns a concise summary of the provided text. Accepts task descriptions, project notes, or comment threads."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Summary generated successfully"),
            @ApiResponse(responseCode = "400", description = "Validation error — content is required"),
            @ApiResponse(responseCode = "401", description = "Unauthorised")
    })
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    @PostMapping("/summarize")
    public ResponseEntity<SummarizeResponse> summarize(@Valid @RequestBody SummarizeRequest request) {
        return ResponseEntity.ok(aiService.summarize(request));
    }

    @Operation(
            summary = "Suggest task priority",
            description = "Analyses the task title, description, and due date to recommend a priority level (LOW / MEDIUM / HIGH / URGENT) with a confidence score."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Priority suggestion generated successfully"),
            @ApiResponse(responseCode = "400", description = "Validation error — title is required"),
            @ApiResponse(responseCode = "401", description = "Unauthorised")
    })
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    @PostMapping("/suggest-priority")
    public ResponseEntity<SuggestPriorityResponse> suggestPriority(@Valid @RequestBody SuggestPriorityRequest request) {
        return ResponseEntity.ok(aiService.suggestPriority(request));
    }

    @Operation(
            summary = "Generate description",
            description = "Generates a professional description for a task or project based on its title and optional hints."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Description generated successfully"),
            @ApiResponse(responseCode = "400", description = "Validation error — title is required"),
            @ApiResponse(responseCode = "401", description = "Unauthorised")
    })
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    @PostMapping("/generate-description")
    public ResponseEntity<GenerateDescriptionResponse> generateDescription(@Valid @RequestBody GenerateDescriptionRequest request) {
        return ResponseEntity.ok(aiService.generateDescription(request));
    }
}
