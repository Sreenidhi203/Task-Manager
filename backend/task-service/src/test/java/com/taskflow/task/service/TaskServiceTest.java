package com.taskflow.task.service;

import com.taskflow.task.dto.request.CreateTaskRequest;
import com.taskflow.task.dto.request.UpdateTaskRequest;
import com.taskflow.task.dto.response.TaskResponse;
import com.taskflow.task.entity.Project;
import com.taskflow.task.entity.Task;
import com.taskflow.task.entity.TaskPriority;
import com.taskflow.task.entity.TaskStatus;
import com.taskflow.task.exception.ResourceNotFoundException;
import com.taskflow.task.mapper.TaskMapper;
import com.taskflow.task.repository.ProjectRepository;
import com.taskflow.task.repository.TaskRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock TaskRepository taskRepository;
    @Mock ProjectRepository projectRepository;
    @Mock TaskMapper taskMapper;
    @InjectMocks TaskService taskService;

    private Project sampleProject() {
        return Project.builder().id(1L).name("P1").ownerId(1L).tasks(new ArrayList<>()).build();
    }

    private Task sampleTask(Project p) {
        return Task.builder().id(1L).title("T1").project(p)
                .status(TaskStatus.TODO).priority(TaskPriority.MEDIUM)
                .comments(new ArrayList<>()).build();
    }

    private TaskResponse sampleResponse() {
        return new TaskResponse(1L, "T1", null, 1L, "P1", null,
                "TODO", "MEDIUM", null, 0, Instant.now(), Instant.now());
    }

    @Test
    void getById_found() {
        Project p = sampleProject();
        Task t = sampleTask(p);
        when(taskRepository.findById(1L)).thenReturn(Optional.of(t));
        when(taskMapper.toResponse(t)).thenReturn(sampleResponse());

        assertThat(taskService.getById(1L).title()).isEqualTo("T1");
    }

    @Test
    void getById_notFound_throws() {
        when(taskRepository.findById(99L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> taskService.getById(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void create_success() {
        Project p = sampleProject();
        CreateTaskRequest req = new CreateTaskRequest();
        req.setTitle("New Task"); req.setProjectId(1L);

        Task entity = sampleTask(p);
        when(projectRepository.findById(1L)).thenReturn(Optional.of(p));
        when(taskMapper.toEntity(req, p)).thenReturn(entity);
        when(taskRepository.save(entity)).thenReturn(entity);
        when(taskMapper.toResponse(entity)).thenReturn(sampleResponse());

        assertThat(taskService.create(req).title()).isEqualTo("T1");
        verify(taskRepository).save(entity);
    }

    @Test
    void create_projectNotFound_throws() {
        CreateTaskRequest req = new CreateTaskRequest();
        req.setProjectId(99L);
        when(projectRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.create(req))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void update_changesStatus() {
        Project p = sampleProject();
        Task t = sampleTask(p);
        UpdateTaskRequest req = new UpdateTaskRequest();
        req.setStatus("IN_PROGRESS");

        when(taskRepository.findById(1L)).thenReturn(Optional.of(t));
        when(taskMapper.parseStatus("IN_PROGRESS")).thenReturn(TaskStatus.IN_PROGRESS);
        when(taskRepository.save(any())).thenReturn(t);
        when(taskMapper.toResponse(any())).thenReturn(sampleResponse());

        taskService.update(1L, req);
        assertThat(t.getStatus()).isEqualTo(TaskStatus.IN_PROGRESS);
    }

    @Test
    void delete_notFound_throws() {
        when(taskRepository.existsById(5L)).thenReturn(false);
        assertThatThrownBy(() -> taskService.delete(5L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void assign_updatesAssignee() {
        Project p = sampleProject();
        Task t = sampleTask(p);
        when(taskRepository.findById(1L)).thenReturn(Optional.of(t));
        when(taskRepository.save(any())).thenReturn(t);
        when(taskMapper.toResponse(any())).thenReturn(sampleResponse());

        taskService.assign(1L, 42L);
        assertThat(t.getAssigneeId()).isEqualTo(42L);
    }
}
