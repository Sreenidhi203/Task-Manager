package com.taskflow.task.service;

import com.taskflow.task.dto.request.CreateTaskRequest;
import com.taskflow.task.dto.request.UpdateTaskRequest;
import com.taskflow.task.dto.response.TaskResponse;
import com.taskflow.task.entity.Project;
import com.taskflow.task.entity.Task;
import com.taskflow.task.entity.TaskPriority;
import com.taskflow.task.entity.TaskStatus;
import com.taskflow.task.exception.ResourceNotFoundException;
import com.taskflow.task.mapper.TaskMapper;
import com.taskflow.task.repository.ProjectRepository;
import com.taskflow.task.repository.TaskRepository;
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
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final TaskMapper taskMapper;

    @Transactional(readOnly = true)
    public Page<TaskResponse> getAll(String keyword, String status, String priority,
                                     Long projectId, Long assigneeId,
                                     int page, int size, String sortBy, String dir) {
        TaskStatus   statusEnum   = parse(status,   TaskStatus.class);
        TaskPriority priorityEnum = parse(priority, TaskPriority.class);
        Sort sort = Sort.by(Sort.Direction.fromString(dir), sortBy);
        return taskRepository.search(keyword, statusEnum, priorityEnum, projectId, assigneeId,
                        PageRequest.of(page, size, sort))
                .map(taskMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public TaskResponse getById(Long id) {
        return taskMapper.toResponse(findOrThrow(id));
    }

    @Transactional
    public TaskResponse create(CreateTaskRequest req) {
        Project project = projectRepository.findById(req.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project", req.getProjectId()));
        Task task = taskMapper.toEntity(req, project);
        return taskMapper.toResponse(taskRepository.save(task));
    }

    @Transactional
    public TaskResponse update(Long id, UpdateTaskRequest req) {
        Task task = findOrThrow(id);
        if (req.getTitle()       != null) task.setTitle(req.getTitle());
        if (req.getDescription() != null) task.setDescription(req.getDescription());
        if (req.getAssigneeId()  != null) task.setAssigneeId(req.getAssigneeId());
        if (req.getStatus()      != null) task.setStatus(taskMapper.parseStatus(req.getStatus()));
        if (req.getPriority()    != null) task.setPriority(taskMapper.parsePriority(req.getPriority()));
        if (req.getDueDate()     != null) task.setDueDate(req.getDueDate());
        return taskMapper.toResponse(taskRepository.save(task));
    }

    @Transactional
    public void delete(Long id) {
        if (!taskRepository.existsById(id)) throw new ResourceNotFoundException("Task", id);
        taskRepository.deleteById(id);
        log.info("Deleted task id={}", id);
    }

    @Transactional
    public TaskResponse assign(Long id, Long assigneeId) {
        Task task = findOrThrow(id);
        task.setAssigneeId(assigneeId);
        return taskMapper.toResponse(taskRepository.save(task));
    }

    private Task findOrThrow(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", id));
    }

    private <E extends Enum<E>> E parse(String value, Class<E> enumClass) {
        if (value == null || value.isBlank()) return null;
        try { return Enum.valueOf(enumClass, value.toUpperCase()); }
        catch (IllegalArgumentException e) { return null; }
    }
}
