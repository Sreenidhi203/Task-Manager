CREATE TABLE IF NOT EXISTS projects (
    id          BIGSERIAL    PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id    BIGINT       NOT NULL,
    status      VARCHAR(50)  NOT NULL DEFAULT 'ACTIVE',
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tasks (
    id          BIGSERIAL    PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    project_id  BIGINT       NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    assignee_id BIGINT,
    status      VARCHAR(50)  NOT NULL DEFAULT 'TODO',
    priority    VARCHAR(50)  NOT NULL DEFAULT 'MEDIUM',
    due_date    DATE,
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS comments (
    id          BIGSERIAL    PRIMARY KEY,
    content     TEXT         NOT NULL,
    task_id     BIGINT       NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    author_id   BIGINT       NOT NULL,
    author_name VARCHAR(100),
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tasks_project_id  ON tasks(project_id);
CREATE INDEX idx_tasks_assignee_id ON tasks(assignee_id);
CREATE INDEX idx_tasks_status      ON tasks(status);
CREATE INDEX idx_tasks_priority    ON tasks(priority);
CREATE INDEX idx_comments_task_id  ON comments(task_id);
