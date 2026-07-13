package com.example.taskmanager.service;

import com.example.taskmanager.dto.response.NotificationResponse;
import com.example.taskmanager.entity.Notification;
import com.example.taskmanager.entity.User;
import com.example.taskmanager.mapper.NotificationMapper;
import com.example.taskmanager.repository.NotificationRepository;
import com.example.taskmanager.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private NotificationMapper notificationMapper;

    @InjectMocks
    private NotificationService notificationService;

    @Test
    void shouldReturnUnreadNotificationsForCurrentUser() {
        User user = new User();
        user.setId(1L);
        user.setEmail("user@example.com");

        Notification notification = new Notification();
        notification.setId(10L);
        notification.setUser(user);
        notification.setTitle("Welcome");
        notification.setMessage("Hello");
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());

        NotificationResponse response = new NotificationResponse();
        response.setId(10L);
        response.setTitle("Welcome");
        response.setMessage("Hello");
        response.setRead(false);

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(1L)).thenReturn(List.of(notification));
        when(notificationMapper.toResponse(notification)).thenReturn(response);

        List<NotificationResponse> result = notificationService.getUnreadNotifications("user@example.com");

        assertEquals(1, result.size());
        assertEquals("Welcome", result.get(0).getTitle());
        assertTrue(!result.get(0).isRead());
    }

    @Test
    void shouldMarkNotificationAsReadAndPersistChanges() {
        User user = new User();
        user.setId(1L);
        user.setEmail("user@example.com");

        Notification notification = new Notification();
        notification.setId(10L);
        notification.setUser(user);
        notification.setRead(false);

        NotificationResponse response = new NotificationResponse();
        response.setId(10L);
        response.setRead(true);

        when(notificationRepository.findById(10L)).thenReturn(Optional.of(notification));
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(notificationRepository.save(any(Notification.class))).thenReturn(notification);
        when(notificationMapper.toResponse(notification)).thenReturn(response);

        NotificationResponse result = notificationService.markAsRead(10L, "user@example.com");

        assertTrue(result.isRead());
        assertTrue(notification.isRead());
        verify(notificationRepository).save(notification);
    }
}
