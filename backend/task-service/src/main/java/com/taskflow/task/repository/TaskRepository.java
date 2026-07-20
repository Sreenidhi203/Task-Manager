package com.taskflow.task.repository;

import com.taskflow.task.entity.Task;
import com.taskflow.task.entity.TaskPriority;
import com.taskflow.task.entity.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    @Query("""
            SELECT t FROM Task t
            WHERE (:keyword IS NULL OR :keyword = ''
                   OR LOWER(t.title)       LIKE LOWER(CONCAT('%',:keyword,'%'))
                   OR LOWER(t.description) LIKE LOWER(CONCAT('%',:keyword,'%')))
            AND (:status     IS NULL OR t.status     = :status)
            AND (:priority   IS NULL OR t.priority   = :priority)
            AND (:projectId  IS NULL OR t.project.id = :projectId)
            AND (:assigneeId IS NULL OR t.assigneeId = :assigneeId)
            """)
    Page<Task> search(@Param("keyword")    String keyword,
                      @Param("status")     TaskStatus status,
                      @Param("priority")   TaskPriority priority,
                      @Param("projectId")  Long projectId,
                      @Param("assigneeId") Long assigneeId,
                      Pageable pageable);
}
