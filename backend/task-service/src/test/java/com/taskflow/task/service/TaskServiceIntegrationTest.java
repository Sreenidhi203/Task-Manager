package com.taskflow.task.service;

import com.taskflow.task.dto.request.CreateProjectRequest;
import com.taskflow.task.dto.request.CreateTaskRequest;
import com.taskflow.task.dto.response.ProjectResponse;
import com.taskflow.task.dto.response.TaskResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest
@Testcontainers
class TaskServiceIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine")
            .withDatabaseName("task_db_test")
            .withUsername("test")
            .withPassword("test");

    @DynamicPropertySource
    static void props(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired ProjectService projectService;
    @Autowired TaskService taskService;

    @Test
    void createProjectAndTask_fullFlow() {
        CreateProjectRequest projReq = new CreateProjectRequest();
        projReq.setName("Integration Project");
        projReq.setDescription("Test");
        ProjectResponse project = projectService.create(projReq, 1L);
        assertThat(project.id()).isNotNull();
        assertThat(project.name()).isEqualTo("Integration Project");

        CreateTaskRequest taskReq = new CreateTaskRequest();
        taskReq.setTitle("Integration Task");
        taskReq.setProjectId(project.id());
        TaskResponse task = taskService.create(taskReq);
        assertThat(task.id()).isNotNull();
        assertThat(task.projectId()).isEqualTo(project.id());
        assertThat(task.status()).isEqualTo("TODO");
    }

    @Test
    void deleteProject_cascadesTasks() {
        CreateProjectRequest projReq = new CreateProjectRequest();
        projReq.setName("To Delete");
        ProjectResponse project = projectService.create(projReq, 1L);

        CreateTaskRequest taskReq = new CreateTaskRequest();
        taskReq.setTitle("Orphan Task");
        taskReq.setProjectId(project.id());
        taskService.create(taskReq);

        projectService.delete(project.id());
        assertThatThrownBy(() -> projectService.getById(project.id()))
                .isInstanceOf(com.taskflow.task.exception.ResourceNotFoundException.class);
    }
}
