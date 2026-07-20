package com.taskflow.task.repository;

import com.taskflow.task.entity.Project;
import com.taskflow.task.entity.ProjectStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    @Query("""
            SELECT p FROM Project p
            WHERE (:keyword IS NULL OR :keyword = ''
                   OR LOWER(p.name)        LIKE LOWER(CONCAT('%',:keyword,'%'))
                   OR LOWER(p.description) LIKE LOWER(CONCAT('%',:keyword,'%')))
            AND (:status IS NULL OR p.status = :status)
            AND (:ownerId IS NULL OR p.ownerId = :ownerId)
            """)
    Page<Project> search(@Param("keyword") String keyword,
                         @Param("status")  ProjectStatus status,
                         @Param("ownerId") Long ownerId,
                         Pageable pageable);
}
