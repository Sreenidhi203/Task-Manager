package com.example.taskmanager.controller;

import com.example.taskmanager.dto.request.CreateCommentRequest;
import com.example.taskmanager.dto.request.UpdateCommentRequest;
import com.example.taskmanager.dto.response.CommentResponse;
import com.example.taskmanager.service.CommentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CommentController.class)
class CommentControllerTest extends BaseControllerTest {

    @MockBean
    CommentService commentService;

    private CommentResponse commentResponse;

    @BeforeEach
    void setUp() {
        commentResponse = new CommentResponse();
        commentResponse.setId(1L);
        commentResponse.setContent("Test comment");
        commentResponse.setTaskId(1L);
    }

    @Test
    @WithMockUser(username = "user@example.com")
    void addComment_success_returns200() throws Exception {
        CreateCommentRequest req = new CreateCommentRequest();
        req.setTaskId(1L);
        req.setContent("Test comment");

        when(commentService.addComment(anyString(), any())).thenReturn(commentResponse);

        mockMvc.perform(post("/api/v1/comments")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.content").value("Test comment"));
    }

    @Test
    void addComment_unauthenticated_returns403() throws Exception {
        mockMvc.perform(post("/api/v1/comments")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "user@example.com")
    void editComment_success_returns200() throws Exception {
        UpdateCommentRequest req = new UpdateCommentRequest();
        req.setContent("Updated comment");

        when(commentService.editComment(eq(1L), anyString(), any())).thenReturn(commentResponse);

        mockMvc.perform(put("/api/v1/comments/1")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    @WithMockUser(username = "user@example.com")
    void deleteComment_success_returns204() throws Exception {
        doNothing().when(commentService).deleteComment(eq(1L), anyString());

        mockMvc.perform(delete("/api/v1/comments/1").with(csrf()))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser(username = "user@example.com")
    void getTaskComments_returns200() throws Exception {
        when(commentService.getTaskComments(1L)).thenReturn(List.of(commentResponse));

        mockMvc.perform(get("/api/v1/comments/task/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1));
    }
}
