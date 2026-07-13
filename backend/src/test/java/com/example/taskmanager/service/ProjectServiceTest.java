package com.example.taskmanager.service;

import com.example.taskmanager.dto.request.CreateProjectRequest;
import com.example.taskmanager.dto.request.UpdateProjectRequest;
import com.example.taskmanager.dto.response.ProjectResponse;
import com.example.taskmanager.entity.Project;
import com.example.taskmanager.entity.User;
import com.example.taskmanager.exception.ProjectNotFoundException;
import com.example.taskmanager.exception.UserNotFoundException;
import com.example.taskmanager.mapper.ProjectMapper;
import com.example.taskmanager.repository.ProjectRepository;
import com.example.taskmanager.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {

    @Mock ProjectRepository projectRepository;
    @Mock UserRepository userRepository;
    @Mock ProjectMapper projectMapper;
    @InjectMocks ProjectService projectService;

    private Project project;
    private ProjectResponse projectResponse;
    private User owner;

    @BeforeEach
    void setUp() {
        owner = new User();
        owner.setId(1L);

        project = new Project();
        project.setId(1L);
        project.setName("Project A");
        project.setOwner(owner);

        projectResponse = new ProjectResponse();
        projectResponse.setId(1L);
        projectResponse.setName("Project A");
    }

    @Test
    void getProjects_returnsPage() {
        Page<Project> page = new PageImpl<>(List.of(project));
        when(projectRepository.searchProjects(any(), any(), any(Pageable.class))).thenReturn(page);
        when(projectMapper.toResponse(project)).thenReturn(projectResponse);

        Page<ProjectResponse> result = projectService.getProjects(null, null, 0, 10, "createdAt", "desc");

        assertThat(result.getContent()).hasSize(1);
    }

    @Test
    void getProjectById_found() {
        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
        when(projectMapper.toResponse(project)).thenReturn(projectResponse);

        ProjectResponse result = projectService.getProjectById(1L);

        assertThat(result.getId()).isEqualTo(1L);
    }

    @Test
    void getProjectById_notFound_throws() {
        when(projectRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> projectService.getProjectById(99L))
                .isInstanceOf(ProjectNotFoundException.class);
    }

    @Test
    void createProject_success() {
        CreateProjectRequest req = new CreateProjectRequest();
        req.setName("New Project");
        req.setOwnerId(1L);

        when(userRepository.findById(1L)).thenReturn(Optional.of(owner));
        when(projectMapper.toEntity(req, owner)).thenReturn(project);
        when(projectRepository.save(project)).thenReturn(project);
        when(projectMapper.toResponse(project)).thenReturn(projectResponse);

        ProjectResponse result = projectService.createProject(req);

        assertThat(result).isNotNull();
        verify(projectRepository).save(project);
    }

    @Test
    void createProject_ownerNotFound_throws() {
        CreateProjectRequest req = new CreateProjectRequest();
        req.setOwnerId(99L);
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> projectService.createProject(req))
                .isInstanceOf(UserNotFoundException.class);
    }

    @Test
    void updateProject_success() {
        UpdateProjectRequest req = new UpdateProjectRequest();
        req.setName("Updated");

        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
        when(projectRepository.save(project)).thenReturn(project);
        when(projectMapper.toResponse(project)).thenReturn(projectResponse);

        ProjectResponse result = projectService.updateProject(1L, req);

        assertThat(result).isNotNull();
        verify(projectMapper).updateEntity(project, req, null);
    }

    @Test
    void updateProject_notFound_throws() {
        when(projectRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> projectService.updateProject(99L, new UpdateProjectRequest()))
                .isInstanceOf(ProjectNotFoundException.class);
    }

    @Test
    void deleteProject_success() {
        when(projectRepository.existsById(1L)).thenReturn(true);

        projectService.deleteProject(1L);

        verify(projectRepository).deleteById(1L);
    }

    @Test
    void deleteProject_notFound_throws() {
        when(projectRepository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> projectService.deleteProject(99L))
                .isInstanceOf(ProjectNotFoundException.class);
    }
}
