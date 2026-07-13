package com.example.taskmanager.controller;

import com.example.taskmanager.dto.request.CreateTaskRequest;
import com.example.taskmanager.dto.request.UpdateTaskRequest;
import com.example.taskmanager.dto.response.TaskResponse;
import com.example.taskmanager.service.TaskService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TaskController.class)
class TaskControllerTest extends BaseControllerTest {

    @MockBean
    TaskService taskService;

    private TaskResponse taskResponse;

    @BeforeEach
    void setUp() {
        taskResponse = new TaskResponse();
        taskResponse.setId(1L);
        taskResponse.setTitle("Task 1");
        taskResponse.setStatus("TODO");
        taskResponse.setPriority("MEDIUM");
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getTasks_returns200() throws Exception {
        when(taskService.getTasks(any(), any(), any(), anyInt(), anyInt(), anyString(), anyString()))
                .thenReturn(new PageImpl<>(List.of(taskResponse)));

        mockMvc.perform(get("/api/v1/tasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(1));
    }

    @Test
    void getTasks_unauthenticated_returns403() throws Exception {
        mockMvc.perform(get("/api/v1/tasks"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "EMPLOYEE")
    void getTaskById_found_returns200() throws Exception {
        when(taskService.getTaskById(1L)).thenReturn(taskResponse);

        mockMvc.perform(get("/api/v1/tasks/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Task 1"));
    }

    @Test
    @WithMockUser(roles = "MANAGER")
    void createTask_success_returns200() throws Exception {
        CreateTaskRequest req = new CreateTaskRequest();
        req.setTitle("New Task");
        req.setProjectId(1L);

        when(taskService.createTask(any())).thenReturn(taskResponse);

        mockMvc.perform(post("/api/v1/tasks")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    @WithMockUser(roles = "MANAGER")
    void createTask_missingTitle_returns400() throws Exception {
        CreateTaskRequest req = new CreateTaskRequest();
        req.setProjectId(1L);

        mockMvc.perform(post("/api/v1/tasks")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void updateTask_success_returns200() throws Exception {
        UpdateTaskRequest req = new UpdateTaskRequest();
        req.setTitle("Updated Task");

        when(taskService.updateTask(eq(1L), any())).thenReturn(taskResponse);

        mockMvc.perform(put("/api/v1/tasks/1")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deleteTask_success_returns204() throws Exception {
        doNothing().when(taskService).deleteTask(1L);

        mockMvc.perform(delete("/api/v1/tasks/1").with(csrf()))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser(roles = "EMPLOYEE")
    void deleteTask_forbidden_returns403() throws Exception {
        mockMvc.perform(delete("/api/v1/tasks/1").with(csrf()))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "MANAGER")
    void assignTask_success_returns200() throws Exception {
        when(taskService.assignTask(1L, 2L)).thenReturn(taskResponse);

        mockMvc.perform(post("/api/v1/tasks/1/assign")
                        .with(csrf())
                        .param("assigneeId", "2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }
}
