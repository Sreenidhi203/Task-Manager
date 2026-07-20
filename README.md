# TaskFlow — Enterprise Task Management Platform

A production-grade microservices platform built with **Java 21 + Spring Boot 3 + React 18**.

---

## Architecture

```
                        ┌─────────────────────────────────────────┐
  React SPA (port 3000) │           API Gateway (port 8080)        │
  Redux Toolkit         │   Spring Cloud Gateway + JWT Validation   │
  React Query           │   Routes + CORS + Header Propagation      │
  Material UI           └──────────────┬──────────────────────────┘
                                        │
              ┌─────────────────────────┼──────────────────────────┐
              │                         │                          │
   ┌──────────▼──────┐    ┌─────────────▼──────┐    ┌─────────────▼──────┐
   │  Auth Service   │    │   User Service      │    │   Task Service     │
   │  (port 8081)    │    │   (port 8082)       │    │   (port 8083)      │
   │  JWT issuance   │    │   User CRUD         │    │   Projects + Tasks │
   │  Register/Login │    │   Profile           │    │   Comments         │
   │  auth_db        │    │   user_db           │    │   task_db          │
   └─────────────────┘    └─────────────────────┘    └────────────────────┘
                                                                    │
                                                       ┌────────────▼───────┐
                                                       │ Notification Svc   │
                                                       │ (port 8084)        │
                                                       │ Per-user inbox     │
                                                       │ notification_db    │
                                                       └────────────────────┘
```

### Key Design Decisions

| Concern | Approach |
|---|---|
| Auth | JWT issued by auth-service, validated at gateway, propagated as `X-User-*` headers |
| DB isolation | Each service owns its own PostgreSQL database |
| Schema management | Flyway migrations per service (`db/migration/V*.sql`) |
| Security | Gateway validates JWT; downstream services trust gateway headers via `GatewayAuthFilter` |
| Transactions | `@Transactional` on all service methods; read-only where applicable |
| Pagination | Server-side via Spring Data `Pageable` on all list endpoints |
| Filtering | JPQL `@Query` with optional parameters on all repositories |
| Error handling | `@RestControllerAdvice` + `ErrorResponse` record per service |
| Auditing | `@EntityListeners(AuditingEntityListener.class)` + `@EnableJpaAuditing` |

---

## Services

| Service | Port | Database | Responsibilities |
|---|---|---|---|
| api-gateway | 8080 | — | Routing, JWT validation, CORS |
| auth-service | 8081 | auth_db | Register, login, JWT issuance |
| user-service | 8082 | user_db | User CRUD, profile management |
| task-service | 8083 | task_db | Projects, tasks, comments |
| notification-service | 8084 | notification_db | Per-user notifications |
| frontend | 3000/80 | — | React SPA |

---

## Quick Start (Docker)

```bash
# 1. Copy and configure environment
cp .env.example .env

# 2. Build all service JARs
build-all.cmd

# 3. Start everything
docker-compose up --build

# Frontend → http://localhost:3000
# Gateway  → http://localhost:8080
# Swagger  → http://localhost:8081/swagger-ui.html  (auth)
#            http://localhost:8082/swagger-ui.html  (users)
#            http://localhost:8083/swagger-ui.html  (tasks)
#            http://localhost:8084/swagger-ui.html  (notifications)
```

---

## Quick Start (Local Dev)

### Prerequisites
- Java 21, Maven 3.9+
- Node.js 20+
- PostgreSQL 16 running locally

### Backend services (run each in a separate terminal)

```bash
# Create databases first
psql -U postgres -c "CREATE DATABASE auth_db;"
psql -U postgres -c "CREATE DATABASE user_db;"
psql -U postgres -c "CREATE DATABASE task_db;"
psql -U postgres -c "CREATE DATABASE notification_db;"

# Auth service
cd auth-service && mvn spring-boot:run

# User service
cd user-service && mvn spring-boot:run

# Task service
cd task-service && mvn spring-boot:run

# Notification service
cd notification-service && mvn spring-boot:run

# API Gateway
cd api-gateway && mvn spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
# → http://localhost:3000
```

---

## Running Tests

```bash
# All services at once
test-all.cmd

# Individual service (unit + integration via Testcontainers)
cd auth-service && mvn test
cd user-service && mvn test
cd task-service && mvn test
cd notification-service && mvn test
```

Testcontainers spins up a real PostgreSQL container for integration tests — no manual DB setup needed.

---

## API Reference

All requests go through the gateway at `http://localhost:8080`.

### Auth (public)
| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user, returns JWT |
| POST | `/api/auth/login` | Login, returns JWT |

### Users (requires JWT)
| Method | Path | Role |
|---|---|---|
| GET | `/api/users` | ADMIN |
| GET | `/api/users/{id}` | ADMIN, MANAGER |
| POST | `/api/users` | ADMIN |
| PUT | `/api/users/{id}` | ADMIN |
| DELETE | `/api/users/{id}` | ADMIN |
| GET | `/api/profile` | Any |
| PUT | `/api/profile` | Any |

### Projects (requires JWT)
| Method | Path | Role |
|---|---|---|
| GET | `/api/projects` | Any |
| GET | `/api/projects/{id}` | Any |
| POST | `/api/projects` | MANAGER, ADMIN |
| PUT | `/api/projects/{id}` | MANAGER, ADMIN |
| DELETE | `/api/projects/{id}` | ADMIN |

### Tasks (requires JWT)
| Method | Path | Role |
|---|---|---|
| GET | `/api/tasks` | Any |
| GET | `/api/tasks/{id}` | Any |
| POST | `/api/tasks` | MANAGER, ADMIN |
| PUT | `/api/tasks/{id}` | Any |
| PATCH | `/api/tasks/{id}/assign` | MANAGER, ADMIN |
| DELETE | `/api/tasks/{id}` | ADMIN |
| GET | `/api/tasks/{id}/comments` | Any |
| POST | `/api/tasks/{id}/comments` | Any |
| DELETE | `/api/tasks/{id}/comments/{cid}` | Author or ADMIN |

### Notifications (requires JWT)
| Method | Path | Description |
|---|---|---|
| GET | `/api/notifications` | Current user's notifications |
| GET | `/api/notifications/unread-count` | Unread badge count |
| PATCH | `/api/notifications/{id}/read` | Mark one as read |
| PATCH | `/api/notifications/read-all` | Mark all as read |

---

## Query Parameters (Pagination + Filtering)

All list endpoints support:

| Param | Default | Description |
|---|---|---|
| `page` | 0 | Zero-based page number |
| `size` | 20 | Items per page |
| `sortBy` | `createdAt` | Field to sort by |
| `dir` | `desc` | `asc` or `desc` |
| `keyword` | — | Full-text search on name/title/description |
| `status` | — | Filter by status enum value |
| `priority` | — | Filter by priority (tasks only) |
| `projectId` | — | Filter tasks by project |
| `assigneeId` | — | Filter tasks by assignee |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | Java 21 (records, sealed classes, text blocks) |
| Framework | Spring Boot 3.3, Spring Security, Spring Data JPA |
| Gateway | Spring Cloud Gateway 2023.0 |
| Database | PostgreSQL 16 |
| Migrations | Flyway 10 |
| Auth | JWT (jjwt 0.12) |
| API Docs | SpringDoc OpenAPI 2.5 / Swagger UI |
| Testing | JUnit 5, Mockito, Testcontainers |
| Frontend | React 18, TypeScript, Vite 5 |
| State | Redux Toolkit 2 |
| Data Fetching | TanStack React Query 5 |
| UI | Material UI 5, MUI DataGrid |
| Forms | React Hook Form + Zod |
| HTTP | Axios |
| Container | Docker, Docker Compose |

---

## Roles

| Role | Capabilities |
|---|---|
| `EMPLOYEE` | Read projects/tasks, update own tasks, add comments, view notifications |
| `MANAGER` | All EMPLOYEE + create/update projects and tasks, assign tasks |
| `ADMIN` | All MANAGER + delete anything, manage users |
