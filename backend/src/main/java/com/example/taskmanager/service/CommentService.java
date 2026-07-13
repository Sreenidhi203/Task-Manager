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
import com.example.taskmanager.exception.UserNotFoundException;
import com.example.taskmanager.mapper.CommentMapper;
import com.example.taskmanager.repository.CommentRepository;
import com.example.taskmanager.repository.TaskRepository;
import com.example.taskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final CommentMapper commentMapper;

    public CommentResponse addComment(String currentUserEmail, CreateCommentRequest request) {
        Task task = taskRepository.findById(request.getTaskId())
                .orElseThrow(() -> new TaskNotFoundException(request.getTaskId()));
        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new UserNotFoundException(null));

        Comment comment = commentMapper.toEntity(request, task, user);
        return commentMapper.toResponse(commentRepository.save(comment));
    }

    public CommentResponse editComment(Long commentId, String currentUserEmail, UpdateCommentRequest request) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new CommentNotFoundException(commentId));

        if (!comment.getUser().getEmail().equals(currentUserEmail)) {
            throw new ForbiddenException("You can only edit your own comments");
        }

        commentMapper.updateEntity(comment, request);
        return commentMapper.toResponse(commentRepository.save(comment));
    }

    public void deleteComment(Long commentId, String currentUserEmail) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new CommentNotFoundException(commentId));

        if (!comment.getUser().getEmail().equals(currentUserEmail)) {
            throw new ForbiddenException("You can only delete your own comments");
        }

        commentRepository.delete(comment);
    }

    public List<CommentResponse> getTaskComments(Long taskId) {
        if (!taskRepository.existsById(taskId)) {
            throw new TaskNotFoundException(taskId);
        }
        return commentRepository.findByTaskIdOrderByCreatedAtAsc(taskId).stream()
                .map(commentMapper::toResponse)
                .toList();
    }
}
