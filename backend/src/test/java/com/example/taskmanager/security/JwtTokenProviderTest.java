package com.example.taskmanager.security;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class JwtTokenProviderTest {

    @Test
    void shouldGenerateAndValidateToken() {
        JwtTokenProvider provider = new JwtTokenProvider();

        String token = provider.generateToken("admin@example.com");

        assertThat(token).isNotBlank();
        assertThat(provider.extractUsername(token)).isEqualTo("admin@example.com");
        assertThat(provider.validateToken(token)).isTrue();
    }
}
