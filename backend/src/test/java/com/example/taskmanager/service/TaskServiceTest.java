package com.example.taskmanager.service;

import com.example.taskmanager.dto.request.CreateTaskRequest;
import com.example.taskmanager.dto.request.UpdateTaskRequest;
import com.example.taskmanager.dto.response.TaskResponse;
import com.example.taskmanager.entity.Project;
import com.example.taskmanager.entity.Task;
import com.example.taskmanager.entity.User;
import com.example.taskmanager.exception.ProjectNotFoundException;
import com.example.taskmanager.exception.TaskNotFoundException;
import com.example.taskmanager.exception.UserNotFoundException;
import com.example.taskmanager.mapper.TaskMapper;
import com.example.taskmanager.repository.ProjectRepository;
import com.example.taskmanager.repository.TaskRepository;
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
class TaskServiceTest {

    @Mock TaskRepository taskRepository;
    @Mock ProjectRepository projectRepository;
    @Mock UserRepository userRepository;
    @Mock TaskMapper taskMapper;
    @InjectMocks TaskService taskService;

    private Task task;
    private TaskResponse taskResponse;
    private Project project;
    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setEmail("user@example.com");

        project = new Project();
        project.setId(1L);
        project.setName("Project A");

        task = new Task();
        task.setId(1L);
        task.setTitle("Task 1");
        task.setProject(project);

        taskResponse = new TaskResponse();
        taskResponse.setId(1L);
        taskResponse.setTitle("Task 1");
    }

    @Test
    void getTasks_returnsPage() {
        Page<Task> taskPage = new PageImpl<>(List.of(task));
        when(taskRepository.searchTasks(any(), any(), any(), any(Pageable.class))).thenReturn(taskPage);
        when(taskMapper.toResponse(task)).thenReturn(taskResponse);

        Page<TaskResponse> result = taskService.getTasks(null, null, null, 0, 10, "createdAt", "desc");

        assertThat(result.getContent()).hasSize(1);
    }

    @Test
    void getTaskById_found() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        when(taskMapper.toResponse(task)).thenReturn(taskResponse);

        TaskResponse result = taskService.getTaskById(1L);

        assertThat(result.getId()).isEqualTo(1L);
    }

    @Test
    void getTaskById_notFound_throws() {
        when(taskRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.getTaskById(99L))
                .isInstanceOf(TaskNotFoundException.class);
    }

    @Test
    void createTask_success() {
        CreateTaskRequest req = new CreateTaskRequest();
        req.setTitle("New Task");
        req.setProjectId(1L);

        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
        when(taskMapper.toEntity(req, project, null)).thenReturn(task);
        when(taskRepository.save(task)).thenReturn(task);
        when(taskMapper.toResponse(task)).thenReturn(taskResponse);

        TaskResponse result = taskService.createTask(req);

        assertThat(result).isNotNull();
        verify(taskRepository).save(task);
    }

    @Test
    void createTask_projectNotFound_throws() {
        CreateTaskRequest req = new CreateTaskRequest();
        req.setProjectId(99L);
        when(projectRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.createTask(req))
                .isInstanceOf(ProjectNotFoundException.class);
    }

    @Test
    void createTask_withAssignee_success() {
        CreateTaskRequest req = new CreateTaskRequest();
        req.setTitle("Task");
        req.setProjectId(1L);
        req.setAssigneeId(1L);

        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(taskMapper.toEntity(req, project, user)).thenReturn(task);
        when(taskRepository.save(task)).thenReturn(task);
        when(taskMapper.toResponse(task)).thenReturn(taskResponse);

        TaskResponse result = taskService.createTask(req);

        assertThat(result).isNotNull();
    }

    @Test
    void updateTask_success() {
        UpdateTaskRequest req = new UpdateTaskRequest();
        req.setTitle("Updated");

        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        when(taskRepository.save(task)).thenReturn(task);
        when(taskMapper.toResponse(task)).thenReturn(taskResponse);

        TaskResponse result = taskService.updateTask(1L, req);

        assertThat(result).isNotNull();
        verify(taskMapper).updateEntity(task, req, null, null);
    }

    @Test
    void updateTask_notFound_throws() {
        when(taskRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.updateTask(99L, new UpdateTaskRequest()))
                .isInstanceOf(TaskNotFoundException.class);
    }

    @Test
    void deleteTask_success() {
        when(taskRepository.existsById(1L)).thenReturn(true);

        taskService.deleteTask(1L);

        verify(taskRepository).deleteById(1L);
    }

    @Test
    void deleteTask_notFound_throws() {
        when(taskRepository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> taskService.deleteTask(99L))
                .isInstanceOf(TaskNotFoundException.class);
    }

    @Test
    void assignTask_success() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(taskRepository.save(task)).thenReturn(task);
        when(taskMapper.toResponse(task)).thenReturn(taskResponse);

        TaskResponse result = taskService.assignTask(1L, 1L);

        assertThat(result).isNotNull();
        assertThat(task.getAssignee()).isEqualTo(user);
    }

    @Test
    void assignTask_userNotFound_throws() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.assignTask(1L, 99L))
                .isInstanceOf(UserNotFoundException.class);
    }
}
