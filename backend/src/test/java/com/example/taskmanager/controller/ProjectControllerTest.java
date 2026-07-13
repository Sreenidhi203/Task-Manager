package com.example.taskmanager.controller;

import com.example.taskmanager.dto.request.CreateProjectRequest;
import com.example.taskmanager.dto.request.UpdateProjectRequest;
import com.example.taskmanager.dto.response.ProjectResponse;
import com.example.taskmanager.service.ProjectService;
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

@WebMvcTest(ProjectController.class)
class ProjectControllerTest extends BaseControllerTest {

    @MockBean
    ProjectService projectService;

    private ProjectResponse projectResponse;

    @BeforeEach
    void setUp() {
        projectResponse = new ProjectResponse();
        projectResponse.setId(1L);
        projectResponse.setName("Project A");
        projectResponse.setStatus("ACTIVE");
    }

    @Test
    @WithMockUser(roles = "EMPLOYEE")
    void getProjects_returns200() throws Exception {
        when(projectService.getProjects(any(), any(), anyInt(), anyInt(), anyString(), anyString()))
                .thenReturn(new PageImpl<>(List.of(projectResponse)));

        mockMvc.perform(get("/api/v1/projects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(1));
    }

    @Test
    void getProjects_unauthenticated_returns403() throws Exception {
        mockMvc.perform(get("/api/v1/projects"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getProjectById_found_returns200() throws Exception {
        when(projectService.getProjectById(1L)).thenReturn(projectResponse);

        mockMvc.perform(get("/api/v1/projects/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Project A"));
    }

    @Test
    @WithMockUser(roles = "MANAGER")
    void createProject_success_returns200() throws Exception {
        CreateProjectRequest req = new CreateProjectRequest();
        req.setName("New Project");

        when(projectService.createProject(any())).thenReturn(projectResponse);

        mockMvc.perform(post("/api/v1/projects")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    @WithMockUser(roles = "MANAGER")
    void createProject_missingName_returns400() throws Exception {
        CreateProjectRequest req = new CreateProjectRequest();

        mockMvc.perform(post("/api/v1/projects")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void updateProject_success_returns200() throws Exception {
        UpdateProjectRequest req = new UpdateProjectRequest();
        req.setName("Updated Project");

        when(projectService.updateProject(eq(1L), any())).thenReturn(projectResponse);

        mockMvc.perform(put("/api/v1/projects/1")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deleteProject_success_returns204() throws Exception {
        doNothing().when(projectService).deleteProject(1L);

        mockMvc.perform(delete("/api/v1/projects/1").with(csrf()))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser(roles = "EMPLOYEE")
    void deleteProject_forbidden_returns403() throws Exception {
        mockMvc.perform(delete("/api/v1/projects/1").with(csrf()))
                .andExpect(status().isForbidden());
    }
}
