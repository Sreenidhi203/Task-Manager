package com.taskflow.auth.service;

import com.taskflow.auth.dto.request.LoginRequest;
import com.taskflow.auth.dto.request.RegisterRequest;
import com.taskflow.auth.dto.response.AuthResponse;
import com.taskflow.auth.entity.AuthCredential;
import com.taskflow.auth.entity.Role;
import com.taskflow.auth.exception.EmailAlreadyExistsException;
import com.taskflow.auth.repository.AuthCredentialRepository;
import com.taskflow.auth.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.concurrent.atomic.AtomicLong;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthCredentialRepository credentialRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Value("${jwt.expiration-ms}")
    private long expirationMs;

    // Simulates user-id generation; in production this comes from user-service via event/REST
    private static final AtomicLong userIdSequence = new AtomicLong(1000);

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (credentialRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException(request.getEmail());
        }

        Role role = parseRole(request.getRole());
        long userId = userIdSequence.incrementAndGet();

        AuthCredential credential = AuthCredential.builder()
                .userId(userId)
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .active(true)
                .build();

        credentialRepository.save(credential);
        log.info("Registered new user: email={}, role={}", request.getEmail(), role);

        String token = jwtTokenProvider.generateToken(userId, request.getEmail(), role.name());
        return buildResponse(token, userId, request.getEmail(), role.name());
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        AuthCredential credential = credentialRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!credential.isActive()) {
            throw new BadCredentialsException("Account is disabled");
        }

        if (!passwordEncoder.matches(request.getPassword(), credential.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        log.info("User logged in: email={}", request.getEmail());
        String token = jwtTokenProvider.generateToken(
                credential.getUserId(), credential.getEmail(), credential.getRole().name());
        return buildResponse(token, credential.getUserId(), credential.getEmail(), credential.getRole().name());
    }

    private AuthResponse buildResponse(String token, Long userId, String email, String role) {
        return AuthResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .userId(userId)
                .email(email)
                .role(role)
                .expiresIn(expirationMs / 1000)
                .build();
    }

    private Role parseRole(String role) {
        if (role == null || role.isBlank()) return Role.EMPLOYEE;
        try {
            return Role.valueOf(role.toUpperCase());
        } catch (IllegalArgumentException e) {
            return Role.EMPLOYEE;
        }
    }
}
