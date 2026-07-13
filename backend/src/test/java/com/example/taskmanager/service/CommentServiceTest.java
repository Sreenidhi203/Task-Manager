package com.example.taskmanager.service;

import com.example.taskmanager.dto.request.CreateCommentRequest;
import com.example.taskmanager.dto.request.UpdateCommentRequest;
import com.example.taskmanager.dto.response.CommentResponse;
import com.example.taskmanager.entity.Comment;
import com.example.taskmanager.entity.Task;
import com.example.taskmanager.entity.User;
import com.example.taskmanager.exception.CommentNotFoundException;
import com.example.taskmanager.exception.ForbiddenException;
import com.example.taskmanager.exception.TaskNotFoundException;
import com.example.taskmanager.mapper.CommentMapper;
import com.example.taskmanager.repository.CommentRepository;
import com.example.taskmanager.repository.TaskRepository;
import com.example.taskmanager.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CommentServiceTest {

    @Mock CommentRepository commentRepository;
    @Mock TaskRepository taskRepository;
    @Mock UserRepository userRepository;
    @Mock CommentMapper commentMapper;
    @InjectMocks CommentService commentService;

    private Task task;
    private User user;
    private Comment comment;
    private CommentResponse commentResponse;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setEmail("user@example.com");

        task = new Task();
        task.setId(1L);

        comment = new Comment();
        comment.setId(1L);
        comment.setUser(user);
        comment.setTask(task);

        commentResponse = new CommentResponse();
        commentResponse.setId(1L);
    }

    @Test
    void addComment_success() {
        CreateCommentRequest req = new CreateCommentRequest();
        req.setTaskId(1L);
        req.setContent("Hello");

        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(commentMapper.toEntity(req, task, user)).thenReturn(comment);
        when(commentRepository.save(comment)).thenReturn(comment);
        when(commentMapper.toResponse(comment)).thenReturn(commentResponse);

        CommentResponse result = commentService.addComment("user@example.com", req);

        assertThat(result.getId()).isEqualTo(1L);
    }

    @Test
    void addComment_taskNotFound_throws() {
        CreateCommentRequest req = new CreateCommentRequest();
        req.setTaskId(99L);
        when(taskRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> commentService.addComment("user@example.com", req))
                .isInstanceOf(TaskNotFoundException.class);
    }

    @Test
    void editComment_success() {
        UpdateCommentRequest req = new UpdateCommentRequest();
        req.setContent("Updated");

        when(commentRepository.findById(1L)).thenReturn(Optional.of(comment));
        when(commentRepository.save(comment)).thenReturn(comment);
        when(commentMapper.toResponse(comment)).thenReturn(commentResponse);

        CommentResponse result = commentService.editComment(1L, "user@example.com", req);

        assertThat(result).isNotNull();
        verify(commentMapper).updateEntity(comment, req);
    }

    @Test
    void editComment_notOwner_throws() {
        when(commentRepository.findById(1L)).thenReturn(Optional.of(comment));

        assertThatThrownBy(() -> commentService.editComment(1L, "other@example.com", new UpdateCommentRequest()))
                .isInstanceOf(ForbiddenException.class);
    }

    @Test
    void editComment_notFound_throws() {
        when(commentRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> commentService.editComment(99L, "user@example.com", new UpdateCommentRequest()))
                .isInstanceOf(CommentNotFoundException.class);
    }

    @Test
    void deleteComment_success() {
        when(commentRepository.findById(1L)).thenReturn(Optional.of(comment));

        commentService.deleteComment(1L, "user@example.com");

        verify(commentRepository).delete(comment);
    }

    @Test
    void deleteComment_notOwner_throws() {
        when(commentRepository.findById(1L)).thenReturn(Optional.of(comment));

        assertThatThrownBy(() -> commentService.deleteComment(1L, "other@example.com"))
                .isInstanceOf(ForbiddenException.class);
    }

    @Test
    void getTaskComments_success() {
        when(taskRepository.existsById(1L)).thenReturn(true);
        when(commentRepository.findByTaskIdOrderByCreatedAtAsc(1L)).thenReturn(List.of(comment));
        when(commentMapper.toResponse(comment)).thenReturn(commentResponse);

        List<CommentResponse> result = commentService.getTaskComments(1L);

        assertThat(result).hasSize(1);
    }

    @Test
    void getTaskComments_taskNotFound_throws() {
        when(taskRepository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> commentService.getTaskComments(99L))
                .isInstanceOf(TaskNotFoundException.class);
    }
}
