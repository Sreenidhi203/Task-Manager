package com.example.taskmanager.mapper;

import com.example.taskmanager.dto.request.CreateCommentRequest;
import com.example.taskmanager.dto.request.UpdateCommentRequest;
import com.example.taskmanager.dto.response.CommentResponse;
import com.example.taskmanager.entity.Comment;
import com.example.taskmanager.entity.Task;
import com.example.taskmanager.entity.User;
import org.springframework.stereotype.Component;

@Component
public class CommentMapper {

    public CommentResponse toResponse(Comment comment) {
        CommentResponse response = new CommentResponse();
        response.setId(comment.getId());
        response.setTaskId(comment.getTask().getId());
        response.setUserId(comment.getUser().getId());
        response.setUserName(comment.getUser().getFullName() != null
                ? comment.getUser().getFullName()
                : comment.getUser().getUsername());
        response.setContent(comment.getContent());
        response.setCreatedAt(comment.getCreatedAt());
        response.setUpdatedAt(comment.getUpdatedAt());
        return response;
    }

    public Comment toEntity(CreateCommentRequest request, Task task, User user) {
        Comment comment = new Comment();
        comment.setTask(task);
        comment.setUser(user);
        comment.setContent(request.getContent());
        return comment;
    }

    public void updateEntity(Comment comment, UpdateCommentRequest request) {
        comment.setContent(request.getContent());
        comment.setUpdatedAt(java.time.LocalDateTime.now());
    }
}
