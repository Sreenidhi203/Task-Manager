package com.taskflow.notification.controller;

import com.taskflow.notification.dto.request.CreateNotificationRequest;
import com.taskflow.notification.dto.response.NotificationResponse;
import com.taskflow.notification.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Tag(name = "Notifications")
public class NotificationController {

    private final NotificationService notificationService;

    @Operation(summary = "Get current user notifications")
    @GetMapping
    public ResponseEntity<Page<NotificationResponse>> list(
            @AuthenticationPrincipal UserDetails principal,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {
        Long userId = extractUserId(principal);
        return ResponseEntity.ok(notificationService.getForUser(userId, page, size));
    }

    @Operation(summary = "Get unread notification count")
    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> unreadCount(@AuthenticationPrincipal UserDetails principal) {
        Long userId = extractUserId(principal);
        return ResponseEntity.ok(Map.of("count", notificationService.countUnread(userId)));
    }

    @Operation(summary = "Mark a notification as read")
    @PatchMapping("/{id}/read")
    public ResponseEntity<Void> markRead(@PathVariable Long id,
                                         @AuthenticationPrincipal UserDetails principal) {
        notificationService.markRead(id, extractUserId(principal));
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Mark all notifications as read")
    @PatchMapping("/read-all")
    public ResponseEntity<Map<String, Integer>> markAllRead(@AuthenticationPrincipal UserDetails principal) {
        int updated = notificationService.markAllRead(extractUserId(principal));
        return ResponseEntity.ok(Map.of("updated", updated));
    }

    @Operation(summary = "Create notification — ADMIN only (internal use)")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<NotificationResponse> create(@Valid @RequestBody CreateNotificationRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(notificationService.create(req));
    }

    private Long extractUserId(UserDetails principal) {
        return Long.parseLong(
                (String) ((UsernamePasswordAuthenticationToken) principal).getDetails());
    }
}
