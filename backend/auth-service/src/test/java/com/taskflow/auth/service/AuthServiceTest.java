package com.taskflow.auth.service;

import com.taskflow.auth.dto.request.LoginRequest;
import com.taskflow.auth.dto.request.RegisterRequest;
import com.taskflow.auth.dto.response.AuthResponse;
import com.taskflow.auth.entity.AuthCredential;
import com.taskflow.auth.entity.Role;
import com.taskflow.auth.exception.EmailAlreadyExistsException;
import com.taskflow.auth.repository.AuthCredentialRepository;
import com.taskflow.auth.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock AuthCredentialRepository credentialRepository;
    @Mock PasswordEncoder passwordEncoder;
    @Mock JwtTokenProvider jwtTokenProvider;

    @InjectMocks AuthService authService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(authService, "expirationMs", 86400000L);
    }

    @Test
    void register_success() {
        RegisterRequest req = new RegisterRequest();
        req.setUsername("john");
        req.setEmail("john@example.com");
        req.setPassword("password123");
        req.setFullName("John Doe");

        when(credentialRepository.existsByEmail(req.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(req.getPassword())).thenReturn("hashed");
        when(credentialRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(jwtTokenProvider.generateToken(anyLong(), anyString(), anyString())).thenReturn("jwt-token");

        AuthResponse response = authService.register(req);

        assertThat(response.getAccessToken()).isEqualTo("jwt-token");
        assertThat(response.getEmail()).isEqualTo("john@example.com");
        assertThat(response.getRole()).isEqualTo("EMPLOYEE");
        verify(credentialRepository).save(any(AuthCredential.class));
    }

    @Test
    void register_duplicateEmail_throwsException() {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("dup@example.com");
        when(credentialRepository.existsByEmail(req.getEmail())).thenReturn(true);

        assertThatThrownBy(() -> authService.register(req))
                .isInstanceOf(EmailAlreadyExistsException.class);
        verify(credentialRepository, never()).save(any());
    }

    @Test
    void login_success() {
        LoginRequest req = new LoginRequest();
        req.setEmail("john@example.com");
        req.setPassword("password123");

        AuthCredential credential = AuthCredential.builder()
                .userId(1001L).email(req.getEmail())
                .password("hashed").role(Role.EMPLOYEE).active(true).build();

        when(credentialRepository.findByEmail(req.getEmail())).thenReturn(Optional.of(credential));
        when(passwordEncoder.matches(req.getPassword(), "hashed")).thenReturn(true);
        when(jwtTokenProvider.generateToken(anyLong(), anyString(), anyString())).thenReturn("jwt-token");

        AuthResponse response = authService.login(req);

        assertThat(response.getAccessToken()).isEqualTo("jwt-token");
    }

    @Test
    void login_wrongPassword_throwsBadCredentials() {
        LoginRequest req = new LoginRequest();
        req.setEmail("john@example.com");
        req.setPassword("wrong");

        AuthCredential credential = AuthCredential.builder()
                .userId(1L).email(req.getEmail())
                .password("hashed").role(Role.EMPLOYEE).active(true).build();

        when(credentialRepository.findByEmail(req.getEmail())).thenReturn(Optional.of(credential));
        when(passwordEncoder.matches("wrong", "hashed")).thenReturn(false);

        assertThatThrownBy(() -> authService.login(req))
                .isInstanceOf(BadCredentialsException.class);
    }
}
