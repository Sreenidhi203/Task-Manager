package com.example.taskmanager.controller;

import com.example.taskmanager.dto.request.CreateCommentRequest;
import com.example.taskmanager.dto.request.UpdateCommentRequest;
import com.example.taskmanager.dto.response.CommentResponse;
import com.example.taskmanager.service.CommentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/comments")
@RequiredArgsConstructor
@Tag(name = "Comment Management", description = "Add, edit, delete, and retrieve task comments")
public class CommentController {

    private final CommentService commentService;

    @Operation(summary = "Add comment", description = "Adds a comment to a task")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Comment added successfully"),
            @ApiResponse(responseCode = "400", description = "Validation error")
    })
    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public ResponseEntity<CommentResponse> addComment(Authentication authentication,
                                                      @Valid @RequestBody CreateCommentRequest request) {
        return ResponseEntity.ok(commentService.addComment(authentication.getName(), request));
    }

    @Operation(summary = "Edit comment", description = "Edits an existing comment")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Comment updated successfully"),
            @ApiResponse(responseCode = "404", description = "Comment not found")
    })
    @PreAuthorize("isAuthenticated()")
    @PutMapping("/{id}")
    public ResponseEntity<CommentResponse> editComment(Authentication authentication,
                                                       @Parameter(description = "Comment ID") @PathVariable Long id,
                                                       @Valid @RequestBody UpdateCommentRequest request) {
        return ResponseEntity.ok(commentService.editComment(id, authentication.getName(), request));
    }

    @Operation(summary = "Delete comment", description = "Deletes an existing comment")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Comment deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Comment not found")
    })
    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(Authentication authentication,
                                               @Parameter(description = "Comment ID") @PathVariable Long id) {
        commentService.deleteComment(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Get task comments", description = "Returns all comments for a specific task")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Comments retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Task not found")
    })
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/task/{taskId}")
    public ResponseEntity<List<CommentResponse>> getTaskComments(@Parameter(description = "Task ID") @PathVariable Long taskId) {
        return ResponseEntity.ok(commentService.getTaskComments(taskId));
    }
}
