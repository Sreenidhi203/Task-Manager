package com.taskflow.user.controller;

import com.taskflow.user.dto.request.UpdateUserRequest;
import com.taskflow.user.dto.response.UserResponse;
import com.taskflow.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@Tag(name = "Profile", description = "Current user profile")
public class ProfileController {

    private final UserService userService;

    @Operation(summary = "Get current user profile")
    @GetMapping
    public ResponseEntity<UserResponse> me(@AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(userService.getByEmail(principal.getUsername()));
    }

    @Operation(summary = "Update current user profile")
    @PutMapping
    public ResponseEntity<UserResponse> update(@AuthenticationPrincipal UserDetails principal,
                                               @Valid @RequestBody UpdateUserRequest request) {
        UserResponse current = userService.getByEmail(principal.getUsername());
        return ResponseEntity.ok(userService.update(current.id(), request));
    }
}
