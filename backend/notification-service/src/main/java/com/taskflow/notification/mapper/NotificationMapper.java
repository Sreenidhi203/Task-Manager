package com.taskflow.notification.mapper;

import com.taskflow.notification.dto.response.NotificationResponse;
import com.taskflow.notification.entity.Notification;
import org.springframework.stereotype.Component;

@Component
public class NotificationMapper {

    public NotificationResponse toResponse(Notification n) {
        return new NotificationResponse(
                n.getId(), n.getUserId(), n.getTitle(),
                n.getMessage(), n.getType().name(),
                n.isRead(), n.getCreatedAt()
        );
    }
}
