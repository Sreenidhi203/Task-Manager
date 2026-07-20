package com.taskflow.auth.service;

import com.taskflow.auth.dto.request.LoginRequest;
import com.taskflow.auth.dto.request.RegisterRequest;
import com.taskflow.auth.dto.response.AuthResponse;
import com.taskflow.auth.exception.EmailAlreadyExistsException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest
@Testcontainers
class AuthServiceIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine")
            .withDatabaseName("auth_db_test")
            .withUsername("test")
            .withPassword("test");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired AuthService authService;

    @Test
    void registerAndLogin_fullFlow() {
        RegisterRequest reg = new RegisterRequest();
        reg.setUsername("integrationuser");
        reg.setEmail("integration@test.com");
        reg.setPassword("securePass123");
        reg.setFullName("Integration User");

        AuthResponse registered = authService.register(reg);
        assertThat(registered.getAccessToken()).isNotBlank();
        assertThat(registered.getRole()).isEqualTo("EMPLOYEE");

        LoginRequest login = new LoginRequest();
        login.setEmail("integration@test.com");
        login.setPassword("securePass123");

        AuthResponse loggedIn = authService.login(login);
        assertThat(loggedIn.getAccessToken()).isNotBlank();
    }

    @Test
    void register_duplicateEmail_fails() {
        RegisterRequest req = new RegisterRequest();
        req.setUsername("dupuser");
        req.setEmail("dup@test.com");
        req.setPassword("password123");
        req.setFullName("Dup User");

        authService.register(req);

        assertThatThrownBy(() -> authService.register(req))
                .isInstanceOf(EmailAlreadyExistsException.class);
    }

    @Test
    void login_invalidCredentials_fails() {
        LoginRequest req = new LoginRequest();
        req.setEmail("nonexistent@test.com");
        req.setPassword("any");

        assertThatThrownBy(() -> authService.login(req))
                .isInstanceOf(BadCredentialsException.class);
    }
}
