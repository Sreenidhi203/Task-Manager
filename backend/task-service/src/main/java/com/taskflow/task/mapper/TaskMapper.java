package com.taskflow.task.mapper;

import com.taskflow.task.dto.request.CreateTaskRequest;
import com.taskflow.task.dto.response.TaskResponse;
import com.taskflow.task.entity.Project;
import com.taskflow.task.entity.Task;
import com.taskflow.task.entity.TaskPriority;
import com.taskflow.task.entity.TaskStatus;
import org.springframework.stereotype.Component;

@Component
public class TaskMapper {

    public TaskResponse toResponse(Task t) {
        return new TaskResponse(
                t.getId(), t.getTitle(), t.getDescription(),
                t.getProject().getId(), t.getProject().getName(),
                t.getAssigneeId(),
                t.getStatus().name(), t.getPriority().name(),
                t.getDueDate(),
                t.getComments().size(),
                t.getCreatedAt(), t.getUpdatedAt()
        );
    }

    public Task toEntity(CreateTaskRequest req, Project project) {
        return Task.builder()
                .title(req.getTitle())
                .description(req.getDescription())
                .project(project)
                .assigneeId(req.getAssigneeId())
                .status(parseStatus(req.getStatus()))
                .priority(parsePriority(req.getPriority()))
                .dueDate(req.getDueDate())
                .build();
    }

    public TaskStatus parseStatus(String s) {
        if (s == null || s.isBlank()) return TaskStatus.TODO;
        try { return TaskStatus.valueOf(s.toUpperCase()); }
        catch (IllegalArgumentException e) { return TaskStatus.TODO; }
    }

    public TaskPriority parsePriority(String p) {
        if (p == null || p.isBlank()) return TaskPriority.MEDIUM;
        try { return TaskPriority.valueOf(p.toUpperCase()); }
        catch (IllegalArgumentException e) { return TaskPriority.MEDIUM; }
    }
}
