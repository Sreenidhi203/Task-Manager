package com.example.taskmanager.mapper;

import com.example.taskmanager.dto.request.CreateProjectRequest;
import com.example.taskmanager.dto.request.UpdateProjectRequest;
import com.example.taskmanager.dto.response.ProjectResponse;
import com.example.taskmanager.entity.Project;
import com.example.taskmanager.entity.ProjectStatus;
import com.example.taskmanager.entity.User;
import org.springframework.stereotype.Component;

@Component
public class ProjectMapper {

    public ProjectResponse toResponse(Project project) {
        ProjectResponse response = new ProjectResponse();
        response.setId(project.getId());
        response.setName(project.getName());
        response.setDescription(project.getDescription());
        response.setOwnerId(project.getOwner().getId());
        response.setOwnerName(project.getOwner().getFullName() != null
                ? project.getOwner().getFullName()
                : project.getOwner().getUsername());
        response.setStatus(project.getStatus().name());
        response.setCreatedAt(project.getCreatedAt());
        response.setUpdatedAt(project.getUpdatedAt());
        return response;
    }

    public Project toEntity(CreateProjectRequest request, User owner) {
        Project project = new Project();
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setOwner(owner);
        project.setStatus(parseStatus(request.getStatus()));
        return project;
    }

    public void updateEntity(Project project, UpdateProjectRequest request, User owner) {
        if (request.getName() != null && !request.getName().isBlank()) {
            project.setName(request.getName());
        }
        if (request.getDescription() != null) {
            project.setDescription(request.getDescription());
        }
        if (owner != null) {
            project.setOwner(owner);
        }
        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            project.setStatus(parseStatus(request.getStatus()));
        }
        project.setUpdatedAt(java.time.LocalDateTime.now());
    }

    private ProjectStatus parseStatus(String status) {
        if (status == null || status.isBlank()) {
            return ProjectStatus.ACTIVE;
        }
        return switch (status.toUpperCase()) {
            case "ON_HOLD" -> ProjectStatus.ON_HOLD;
            case "COMPLETED" -> ProjectStatus.COMPLETED;
            case "ARCHIVED" -> ProjectStatus.ARCHIVED;
            default -> ProjectStatus.ACTIVE;
        };
    }
}
