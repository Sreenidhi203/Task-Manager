package com.taskflow.task.mapper;

import com.taskflow.task.dto.request.CreateProjectRequest;
import com.taskflow.task.dto.response.ProjectResponse;
import com.taskflow.task.entity.Project;
import com.taskflow.task.entity.ProjectStatus;
import org.springframework.stereotype.Component;

@Component
public class ProjectMapper {

    public ProjectResponse toResponse(Project p) {
        return new ProjectResponse(
                p.getId(), p.getName(), p.getDescription(),
                p.getOwnerId(), p.getStatus().name(),
                p.getTasks().size(),
                p.getCreatedAt(), p.getUpdatedAt()
        );
    }

    public Project toEntity(CreateProjectRequest req, Long ownerId) {
        return Project.builder()
                .name(req.getName())
                .description(req.getDescription())
                .ownerId(ownerId)
                .status(parseStatus(req.getStatus()))
                .build();
    }

    public ProjectStatus parseStatus(String s) {
        if (s == null || s.isBlank()) return ProjectStatus.ACTIVE;
        try { return ProjectStatus.valueOf(s.toUpperCase()); }
        catch (IllegalArgumentException e) { return ProjectStatus.ACTIVE; }
    }
}
