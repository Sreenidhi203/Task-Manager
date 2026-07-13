package com.example.taskmanager.controller;

import com.example.taskmanager.config.SecurityConfig;
import com.example.taskmanager.security.JwtAuthenticationFilter;
import com.example.taskmanager.security.JwtTokenProvider;
import com.example.taskmanager.service.UserDetailsServiceImpl;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

@Import(SecurityConfig.class)
public abstract class BaseControllerTest {

    @Autowired
    protected MockMvc mockMvc;

    @Autowired
    protected ObjectMapper objectMapper;

    @MockBean
    protected JwtTokenProvider jwtTokenProvider;

    @MockBean
    protected JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockBean
    protected UserDetailsServiceImpl userDetailsService;
}
