package com.taskflow.task.mapper;

import com.taskflow.task.dto.response.CommentResponse;
import com.taskflow.task.entity.Comment;
import org.springframework.stereotype.Component;

@Component
public class CommentMapper {

    public CommentResponse toResponse(Comment c) {
        return new CommentResponse(
                c.getId(), c.getContent(),
                c.getTask().getId(),
                c.getAuthorId(), c.getAuthorName(),
                c.getCreatedAt(), c.getUpdatedAt()
        );
    }
}
