package com.taskflow.user.service;

import com.taskflow.user.dto.request.CreateUserRequest;
import com.taskflow.user.dto.request.UpdateUserRequest;
import com.taskflow.user.dto.response.UserResponse;
import com.taskflow.user.entity.Role;
import com.taskflow.user.entity.User;
import com.taskflow.user.exception.UserNotFoundException;
import com.taskflow.user.mapper.UserMapper;
import com.taskflow.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock UserRepository userRepository;
    @Mock UserMapper userMapper;
    @InjectMocks UserService userService;

    @Test
    void getById_found() {
        User user = User.builder().id(1L).email("a@b.com").role(Role.EMPLOYEE).build();
        UserResponse resp = new UserResponse(1L, "user", "a@b.com", "A B", "EMPLOYEE", true, null);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userMapper.toResponse(user)).thenReturn(resp);

        assertThat(userService.getById(1L).email()).isEqualTo("a@b.com");
    }

    @Test
    void getById_notFound_throws() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> userService.getById(99L))
                .isInstanceOf(UserNotFoundException.class);
    }

    @Test
    void create_savesAndReturns() {
        CreateUserRequest req = new CreateUserRequest();
        req.setUsername("alice"); req.setEmail("alice@x.com"); req.setFullName("Alice");

        User entity = User.builder().id(1L).email("alice@x.com").role(Role.EMPLOYEE).build();
        UserResponse resp = new UserResponse(1L, "alice", "alice@x.com", "Alice", "EMPLOYEE", true, null);

        when(userMapper.toEntity(req)).thenReturn(entity);
        when(userRepository.save(entity)).thenReturn(entity);
        when(userMapper.toResponse(entity)).thenReturn(resp);

        assertThat(userService.create(req).username()).isEqualTo("alice");
    }

    @Test
    void update_changesFullName() {
        User user = User.builder().id(1L).fullName("Old").role(Role.EMPLOYEE).active(true).build();
        UpdateUserRequest req = new UpdateUserRequest();
        req.setFullName("New Name");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any())).thenReturn(user);
        when(userMapper.toResponse(any())).thenReturn(
                new UserResponse(1L, "u", "e@e.com", "New Name", "EMPLOYEE", true, null));

        UserResponse result = userService.update(1L, req);
        assertThat(result.fullName()).isEqualTo("New Name");
    }

    @Test
    void delete_notFound_throws() {
        when(userRepository.existsById(5L)).thenReturn(false);
        assertThatThrownBy(() -> userService.delete(5L))
                .isInstanceOf(UserNotFoundException.class);
    }
}
