package com.taskflow.task.controller;

import com.taskflow.task.dto.request.CreateCommentRequest;
import com.taskflow.task.dto.response.CommentResponse;
import com.taskflow.task.service.CommentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasks/{taskId}/comments")
@RequiredArgsConstructor
@Tag(name = "Comments")
public class CommentController {

    private final CommentService commentService;

    @Operation(summary = "List comments for a task")
    @GetMapping
    public ResponseEntity<Page<CommentResponse>> list(
            @PathVariable Long taskId,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(commentService.getByTask(taskId, page, size));
    }

    @Operation(summary = "Add comment to a task")
    @PostMapping
    public ResponseEntity<CommentResponse> create(
            @PathVariable Long taskId,
            @Valid @RequestBody CreateCommentRequest req,
            @AuthenticationPrincipal UserDetails principal) {
        Long userId = Long.parseLong(
                (String) ((UsernamePasswordAuthenticationToken) principal).getDetails());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(commentService.create(taskId, req, userId, principal.getUsername()));
    }

    @Operation(summary = "Delete a comment")
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> delete(
            @PathVariable Long taskId,
            @PathVariable Long commentId,
            @AuthenticationPrincipal UserDetails principal) {
        Long userId = Long.parseLong(
                (String) ((UsernamePasswordAuthenticationToken) principal).getDetails());
        boolean isAdmin = principal.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        commentService.delete(commentId, userId, isAdmin);
        return ResponseEntity.noContent().build();
    }
}
