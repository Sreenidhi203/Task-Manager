package com.example.taskmanager.mapper;

import com.example.taskmanager.dto.request.CreateTaskRequest;
import com.example.taskmanager.dto.request.UpdateTaskRequest;
import com.example.taskmanager.dto.response.TaskResponse;
import com.example.taskmanager.entity.Project;
import com.example.taskmanager.entity.Task;
import com.example.taskmanager.entity.TaskPriority;
import com.example.taskmanager.entity.TaskStatus;
import com.example.taskmanager.entity.User;
import org.springframework.stereotype.Component;

@Component
public class TaskMapper {

    public TaskResponse toResponse(Task task) {
        TaskResponse response = new TaskResponse();
        response.setId(task.getId());
        response.setTitle(task.getTitle());
        response.setDescription(task.getDescription());
        response.setProjectId(task.getProject().getId());
        response.setProjectName(task.getProject().getName());
        response.setAssigneeId(task.getAssignee() != null ? task.getAssignee().getId() : null);
        response.setAssigneeName(task.getAssignee() != null
                ? (task.getAssignee().getFullName() != null ? task.getAssignee().getFullName() : task.getAssignee().getUsername())
                : null);
        response.setStatus(task.getStatus().name());
        response.setPriority(task.getPriority().name());
        response.setDueDate(task.getDueDate());
        response.setCreatedAt(task.getCreatedAt());
        response.setUpdatedAt(task.getUpdatedAt());
        return response;
    }

    public Task toEntity(CreateTaskRequest request, Project project, User assignee) {
        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setProject(project);
        task.setAssignee(assignee);
        task.setStatus(parseStatus(request.getStatus()));
        task.setPriority(parsePriority(request.getPriority()));
        task.setDueDate(request.getDueDate());
        return task;
    }

    public void updateEntity(Task task, UpdateTaskRequest request, Project project, User assignee) {
        if (request.getTitle() != null && !request.getTitle().isBlank()) {
            task.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            task.setDescription(request.getDescription());
        }
        if (project != null) {
            task.setProject(project);
        }
        if (request.getAssigneeId() != null) {
            task.setAssignee(assignee);
        } else if (request.getAssigneeId() == null && request.getAssigneeId() != null) {
            task.setAssignee(null);
        }
        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            task.setStatus(parseStatus(request.getStatus()));
        }
        if (request.getPriority() != null && !request.getPriority().isBlank()) {
            task.setPriority(parsePriority(request.getPriority()));
        }
        if (request.getDueDate() != null) {
            task.setDueDate(request.getDueDate());
        }
        task.setUpdatedAt(java.time.LocalDateTime.now());
    }

    private TaskStatus parseStatus(String status) {
        if (status == null || status.isBlank()) {
            return TaskStatus.TODO;
        }
        return switch (status.toUpperCase()) {
            case "IN_PROGRESS" -> TaskStatus.IN_PROGRESS;
            case "REVIEW" -> TaskStatus.REVIEW;
            case "DONE" -> TaskStatus.DONE;
            case "BLOCKED" -> TaskStatus.BLOCKED;
            default -> TaskStatus.TODO;
        };
    }

    private TaskPriority parsePriority(String priority) {
        if (priority == null || priority.isBlank()) {
            return TaskPriority.MEDIUM;
        }
        return switch (priority.toUpperCase()) {
            case "LOW" -> TaskPriority.LOW;
            case "HIGH" -> TaskPriority.HIGH;
            case "URGENT" -> TaskPriority.URGENT;
            default -> TaskPriority.MEDIUM;
        };
    }
}
