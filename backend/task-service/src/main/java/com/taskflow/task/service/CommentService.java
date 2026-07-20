package com.taskflow.task.service;

import com.taskflow.task.dto.request.CreateCommentRequest;
import com.taskflow.task.dto.response.CommentResponse;
import com.taskflow.task.entity.Comment;
import com.taskflow.task.entity.Task;
import com.taskflow.task.exception.ResourceNotFoundException;
import com.taskflow.task.mapper.CommentMapper;
import com.taskflow.task.repository.CommentRepository;
import com.taskflow.task.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final TaskRepository taskRepository;
    private final CommentMapper commentMapper;

    @Transactional(readOnly = true)
    public Page<CommentResponse> getByTask(Long taskId, int page, int size) {
        if (!taskRepository.existsById(taskId)) throw new ResourceNotFoundException("Task", taskId);
        return commentRepository.findByTaskId(taskId,
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")))
                .map(commentMapper::toResponse);
    }

    @Transactional
    public CommentResponse create(Long taskId, CreateCommentRequest req, Long authorId, String authorName) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", taskId));
        Comment comment = Comment.builder()
                .content(req.getContent())
                .task(task)
                .authorId(authorId)
                .authorName(authorName)
                .build();
        return commentMapper.toResponse(commentRepository.save(comment));
    }

    @Transactional
    public void delete(Long commentId, Long requesterId, boolean isAdmin) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", commentId));
        if (!isAdmin && !comment.getAuthorId().equals(requesterId)) {
            throw new org.springframework.security.access.AccessDeniedException("Cannot delete another user's comment");
        }
        commentRepository.deleteById(commentId);
    }
}
