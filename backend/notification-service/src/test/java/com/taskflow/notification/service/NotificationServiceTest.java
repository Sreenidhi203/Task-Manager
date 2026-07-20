package com.taskflow.notification.service;

import com.taskflow.notification.dto.request.CreateNotificationRequest;
import com.taskflow.notification.dto.response.NotificationResponse;
import com.taskflow.notification.entity.Notification;
import com.taskflow.notification.entity.NotificationType;
import com.taskflow.notification.mapper.NotificationMapper;
import com.taskflow.notification.repository.NotificationRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock NotificationRepository notificationRepository;
    @Mock NotificationMapper notificationMapper;
    @InjectMocks NotificationService notificationService;

    @Test
    void create_savesNotification() {
        CreateNotificationRequest req = new CreateNotificationRequest();
        req.setUserId(1L); req.setTitle("Test"); req.setMessage("Hello"); req.setType("INFO");

        Notification entity = Notification.builder()
                .id(1L).userId(1L).title("Test").message("Hello")
                .type(NotificationType.INFO).read(false).build();
        NotificationResponse resp = new NotificationResponse(
                1L, 1L, "Test", "Hello", "INFO", false, Instant.now());

        when(notificationRepository.save(any())).thenReturn(entity);
        when(notificationMapper.toResponse(entity)).thenReturn(resp);

        NotificationResponse result = notificationService.create(req);
        assertThat(result.title()).isEqualTo("Test");
        assertThat(result.read()).isFalse();
        verify(notificationRepository).save(any(Notification.class));
    }

    @Test
    void markRead_updatesFlag() {
        Notification n = Notification.builder().id(1L).userId(1L).read(false).build();
        when(notificationRepository.findById(1L)).thenReturn(Optional.of(n));
        when(notificationRepository.save(any())).thenReturn(n);

        notificationService.markRead(1L, 1L);
        assertThat(n.isRead()).isTrue();
    }

    @Test
    void markRead_wrongUser_throws() {
        Notification n = Notification.builder().id(1L).userId(99L).read(false).build();
        when(notificationRepository.findById(1L)).thenReturn(Optional.of(n));

        assertThatThrownBy(() -> notificationService.markRead(1L, 1L))
                .isInstanceOf(org.springframework.security.access.AccessDeniedException.class);
    }

    @Test
    void countUnread_delegatesToRepository() {
        when(notificationRepository.countByUserIdAndReadFalse(1L)).thenReturn(5L);
        assertThat(notificationService.countUnread(1L)).isEqualTo(5L);
    }
}
