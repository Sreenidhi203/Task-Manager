package com.example.taskmanager.service;

import com.example.taskmanager.dto.response.NotificationResponse;
import com.example.taskmanager.entity.Notification;
import com.example.taskmanager.entity.User;
import com.example.taskmanager.exception.ForbiddenException;
import com.example.taskmanager.exception.NotificationNotFoundException;
import com.example.taskmanager.exception.UserNotFoundException;
import com.example.taskmanager.mapper.NotificationMapper;
import com.example.taskmanager.repository.NotificationRepository;
import com.example.taskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final NotificationMapper notificationMapper;

    public List<NotificationResponse> getUnreadNotifications(String currentUserEmail) {
        User user = findUser(currentUserEmail);
        return notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(user.getId()).stream()
                .map(notificationMapper::toResponse)
                .toList();
    }

    public NotificationResponse markAsRead(Long notificationId, String currentUserEmail) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new NotificationNotFoundException(notificationId));

        User user = findUser(currentUserEmail);
        ensureOwner(notification, user);

        notification.setRead(true);
        return notificationMapper.toResponse(notificationRepository.save(notification));
    }

    public void deleteNotification(Long notificationId, String currentUserEmail) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new NotificationNotFoundException(notificationId));

        User user = findUser(currentUserEmail);
        ensureOwner(notification, user);

        notificationRepository.delete(notification);
    }

    public long getUnreadCount(String currentUserEmail) {
        User user = findUser(currentUserEmail);
        return notificationRepository.countByUserIdAndReadFalse(user.getId());
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(null));
    }

    private void ensureOwner(Notification notification, User user) {
        if (!notification.getUser().getId().equals(user.getId())) {
            throw new ForbiddenException("You can only manage your own notifications");
        }
    }
}
