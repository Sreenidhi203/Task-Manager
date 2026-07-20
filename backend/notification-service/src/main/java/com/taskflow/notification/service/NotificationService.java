package com.taskflow.notification.service;

import com.taskflow.notification.dto.request.CreateNotificationRequest;
import com.taskflow.notification.dto.response.NotificationResponse;
import com.taskflow.notification.entity.Notification;
import com.taskflow.notification.entity.NotificationType;
import com.taskflow.notification.mapper.NotificationMapper;
import com.taskflow.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;

    @Transactional(readOnly = true)
    public Page<NotificationResponse> getForUser(Long userId, int page, int size) {
        return notificationRepository.findByUserId(userId,
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")))
                .map(notificationMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public long countUnread(Long userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    @Transactional
    public NotificationResponse create(CreateNotificationRequest req) {
        Notification notification = Notification.builder()
                .userId(req.getUserId())
                .title(req.getTitle())
                .message(req.getMessage())
                .type(parseType(req.getType()))
                .read(false)
                .build();
        return notificationMapper.toResponse(notificationRepository.save(notification));
    }

    @Transactional
    public void markRead(Long id, Long userId) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Notification not found: " + id));
        if (!n.getUserId().equals(userId)) {
            throw new org.springframework.security.access.AccessDeniedException("Not your notification");
        }
        n.setRead(true);
        notificationRepository.save(n);
    }

    @Transactional
    public int markAllRead(Long userId) {
        return notificationRepository.markAllReadByUserId(userId);
    }

    private NotificationType parseType(String type) {
        if (type == null || type.isBlank()) return NotificationType.INFO;
        try { return NotificationType.valueOf(type.toUpperCase()); }
        catch (IllegalArgumentException e) { return NotificationType.INFO; }
    }
}
