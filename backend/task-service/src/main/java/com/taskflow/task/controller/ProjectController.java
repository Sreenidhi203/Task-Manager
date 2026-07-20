package com.taskflow.task.controller;

import com.taskflow.task.dto.request.CreateProjectRequest;
import com.taskflow.task.dto.request.UpdateProjectRequest;
import com.taskflow.task.dto.response.ProjectResponse;
import com.taskflow.task.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@Tag(name = "Projects")
public class ProjectController {

    private final ProjectService projectService;

    @Operation(summary = "List projects")
    @GetMapping
    public ResponseEntity<Page<ProjectResponse>> list(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long ownerId,
            @RequestParam(defaultValue = "0")         int page,
            @RequestParam(defaultValue = "20")        int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc")      String dir) {
        return ResponseEntity.ok(projectService.getAll(keyword, status, ownerId, page, size, sortBy, dir));
    }

    @Operation(summary = "Get project by ID")
    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getById(id));
    }

    @Operation(summary = "Create project — MANAGER or ADMIN")
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    @PostMapping
    public ResponseEntity<ProjectResponse> create(@Valid @RequestBody CreateProjectRequest req,
                                                  @AuthenticationPrincipal UserDetails principal) {
        Long userId = Long.parseLong((String) ((org.springframework.security.authentication
                .UsernamePasswordAuthenticationToken) principal).getDetails());
        return ResponseEntity.status(HttpStatus.CREATED).body(projectService.create(req, userId));
    }

    @Operation(summary = "Update project — MANAGER or ADMIN")
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponse> update(@PathVariable Long id,
                                                  @Valid @RequestBody UpdateProjectRequest req) {
        return ResponseEntity.ok(projectService.update(id, req));
    }

    @Operation(summary = "Delete project — ADMIN only")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        projectService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
