package com.taskflow.task.controller;

import com.taskflow.task.dto.request.CreateTaskRequest;
import com.taskflow.task.dto.request.UpdateTaskRequest;
import com.taskflow.task.dto.response.TaskResponse;
import com.taskflow.task.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@Tag(name = "Tasks")
public class TaskController {

    private final TaskService taskService;

    @Operation(summary = "List tasks with filtering, pagination and sorting")
    @GetMapping
    public ResponseEntity<Page<TaskResponse>> list(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) Long projectId,
            @RequestParam(required = false) Long assigneeId,
            @RequestParam(defaultValue = "0")         int page,
            @RequestParam(defaultValue = "20")        int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc")      String dir) {
        return ResponseEntity.ok(
                taskService.getAll(keyword, status, priority, projectId, assigneeId, page, size, sortBy, dir));
    }

    @Operation(summary = "Get task by ID")
    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getById(id));
    }

    @Operation(summary = "Create task — MANAGER or ADMIN")
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    @PostMapping
    public ResponseEntity<TaskResponse> create(@Valid @RequestBody CreateTaskRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(taskService.create(req));
    }

    @Operation(summary = "Update task")
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN','EMPLOYEE')")
    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> update(@PathVariable Long id,
                                               @Valid @RequestBody UpdateTaskRequest req) {
        return ResponseEntity.ok(taskService.update(id, req));
    }

    @Operation(summary = "Assign task to user — MANAGER or ADMIN")
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    @PatchMapping("/{id}/assign")
    public ResponseEntity<TaskResponse> assign(@PathVariable Long id,
                                               @RequestParam Long assigneeId) {
        return ResponseEntity.ok(taskService.assign(id, assigneeId));
    }

    @Operation(summary = "Delete task — ADMIN only")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        taskService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
