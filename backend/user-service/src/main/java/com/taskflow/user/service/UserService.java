package com.taskflow.user.service;

import com.taskflow.user.dto.request.CreateUserRequest;
import com.taskflow.user.dto.request.UpdateUserRequest;
import com.taskflow.user.dto.response.UserResponse;
import com.taskflow.user.entity.Role;
import com.taskflow.user.entity.User;
import com.taskflow.user.exception.UserNotFoundException;
import com.taskflow.user.mapper.UserMapper;
import com.taskflow.user.repository.UserRepository;
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
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Transactional(readOnly = true)
    public Page<UserResponse> getUsers(String keyword, String role, int page, int size, String sortBy, String dir) {
        Role roleEnum = (role == null || role.isBlank()) ? null : Role.valueOf(role.toUpperCase());
        Sort sort = Sort.by(Sort.Direction.fromString(dir), sortBy);
        return userRepository.search(keyword, roleEnum, PageRequest.of(page, size, sort))
                .map(userMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public UserResponse getById(Long id) {
        return userMapper.toResponse(findOrThrow(id));
    }

    @Transactional(readOnly = true)
    public UserResponse getByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(userMapper::toResponse)
                .orElseThrow(() -> new UserNotFoundException(email));
    }

    @Transactional
    public UserResponse create(CreateUserRequest request) {
        User user = userMapper.toEntity(request);
        return userMapper.toResponse(userRepository.save(user));
    }

    @Transactional
    public UserResponse update(Long id, UpdateUserRequest request) {
        User user = findOrThrow(id);
        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getRole()     != null) user.setRole(userMapper.parseRole(request.getRole()));
        if (request.getActive()   != null) user.setActive(request.getActive());
        return userMapper.toResponse(userRepository.save(user));
    }

    @Transactional
    public void delete(Long id) {
        if (!userRepository.existsById(id)) throw new UserNotFoundException(id);
        userRepository.deleteById(id);
        log.info("Deleted user id={}", id);
    }

    private User findOrThrow(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new UserNotFoundException(id));
    }
}
