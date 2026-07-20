package com.taskflow.task.service;

import com.taskflow.task.dto.request.CreateProjectRequest;
import com.taskflow.task.dto.request.UpdateProjectRequest;
import com.taskflow.task.dto.response.ProjectResponse;
import com.taskflow.task.entity.Project;
import com.taskflow.task.entity.ProjectStatus;
import com.taskflow.task.exception.ResourceNotFoundException;
import com.taskflow.task.mapper.ProjectMapper;
import com.taskflow.task.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMapper projectMapper;

    @Transactional(readOnly = true)
    public Page<ProjectResponse> getAll(String keyword, String status, Long ownerId,
                                        int page, int size, String sortBy, String dir) {
        ProjectStatus statusEnum = (status == null || status.isBlank()) ? null
                : ProjectStatus.valueOf(status.toUpperCase());
        Sort sort = Sort.by(Sort.Direction.fromString(dir), sortBy);
        return projectRepository.search(keyword, statusEnum, ownerId, PageRequest.of(page, size, sort))
                .map(projectMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public ProjectResponse getById(Long id) {
        return projectMapper.toResponse(findOrThrow(id));
    }

    @Transactional
    public ProjectResponse create(CreateProjectRequest req, Long currentUserId) {
        Long ownerId = req.getOwnerId() != null ? req.getOwnerId() : currentUserId;
        Project project = projectMapper.toEntity(req, ownerId);
        return projectMapper.toResponse(projectRepository.save(project));
    }

    @Transactional
    public ProjectResponse update(Long id, UpdateProjectRequest req) {
        Project project = findOrThrow(id);
        if (req.getName()        != null) project.setName(req.getName());
        if (req.getDescription() != null) project.setDescription(req.getDescription());
        if (req.getStatus()      != null) project.setStatus(projectMapper.parseStatus(req.getStatus()));
        return projectMapper.toResponse(projectRepository.save(project));
    }

    @Transactional
    public void delete(Long id) {
        if (!projectRepository.existsById(id)) throw new ResourceNotFoundException("Project", id);
        projectRepository.deleteById(id);
        log.info("Deleted project id={}", id);
    }

    private Project findOrThrow(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", id));
    }
}
