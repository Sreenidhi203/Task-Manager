# Enterprise Task Management System

A full-stack task management platform built with Spring Boot 3 and React 18. Designed for teams that need role-based project and task tracking with a clean REST API and a responsive UI.

---

## Overview

This system allows organizations to manage projects, tasks, users, and notifications across three roles — Admin, Manager, and Employee. The backend exposes a secured REST API documented via Swagger. The frontend is a single-page application that consumes that API.

The AI module is currently scaffolded with a mock provider. It is designed to be swapped with a real provider (e.g. AWS Bedrock) without changing the rest of the codebase.

---

## Architecture

```
task-manager/
├── backend/     # Spring Boot 3 REST API
└── frontend/    # React 18 SPA (Vite + TypeScript)
```

The two sides are fully decoupled. The frontend communicates with the backend over HTTP using JWT tokens for authentication. They can be deployed independently.

```
[React SPA]  ──HTTP/JSON──▶  [Spring Boot API]  ──JPA──▶  [MySQL]
                                     │
                              [JWT Auth Filter]
                                     │
                              [AI Service Layer]
                              (mock / pluggable)
```

---

## Features

**Backend**
- JWT-based authentication and stateless session management
- Role-based access control: `ADMIN`, `MANAGER`, `EMPLOYEE`
- Full CRUD for Projects, Tasks, Comments, and Users
- Notification system per user
- Centralized exception handling with consistent error responses
- Input validation via Bean Validation
- Pluggable AI service layer (mock provider included)
- Swagger UI for interactive API exploration

**Frontend**
- Authentication flow with protected routes
- Dashboard, Projects, and Tasks pages
- Form validation with React Hook Form + Zod
- Axios-based API client with auth token injection
- Tailwind CSS for styling

---

## Folder Structure

```
task-manager/
│
├── backend/
│   ├── src/main/java/com/example/taskmanager/
│   │   ├── ai/              # AI service abstraction + mock provider
│   │   ├── config/          # Security and OpenAPI configuration
│   │   ├── controller/      # REST controllers
│   │   ├── dto/
│   │   │   ├── request/     # Incoming payloads
│   │   │   └── response/    # Outgoing payloads
│   │   ├── entity/          # JPA entities (User, Task, Project, Comment, Notification)
│   │   ├── exception/       # Custom exceptions + GlobalExceptionHandler
│   │   ├── mapper/          # Entity ↔ DTO mappers
│   │   ├── repository/      # Spring Data JPA repositories
│   │   ├── security/        # JWT filter and token provider
│   │   ├── service/         # Business logic
│   │   └── TaskManagerApplication.java
│   ├── src/main/resources/
│   │   └── application.yml
│   ├── src/test/            # Unit tests (service + controller + security)
│   └── pom.xml
│
└── frontend/
    ├── src/
    │   ├── components/      # Shared UI components and ProtectedRoute
    │   ├── context/         # AuthContext
    │   ├── features/        # Feature-scoped API clients and types
    │   │   ├── auth/
    │   │   ├── notifications/
    │   │   ├── projects/
    │   │   └── tasks/
    │   ├── hooks/           # useAuth, useTasks, useProjects, useApi
    │   ├── layouts/         # AppLayout
    │   ├── pages/           # Route-level page components
    │   ├── routes/          # Route definitions
    │   ├── services/        # Axios instance and auth service
    │   └── types/           # Shared TypeScript types
    ├── index.html
    ├── package.json
    └── vite.config.ts
```

---

## API Documentation

All endpoints are prefixed with `/api`.

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Authenticate and receive JWT | Public |
| GET | `/api/projects` | List all projects | Required |
| POST | `/api/projects` | Create a project | MANAGER, ADMIN |
| GET | `/api/projects/{id}` | Get project by ID | Required |
| PUT | `/api/projects/{id}` | Update a project | MANAGER, ADMIN |
| DELETE | `/api/projects/{id}` | Delete a project | ADMIN |
| GET | `/api/tasks` | List all tasks | Required |
| POST | `/api/tasks` | Create a task | MANAGER, ADMIN |
| GET | `/api/tasks/{id}` | Get task by ID | Required |
| PUT | `/api/tasks/{id}` | Update a task | Required |
| DELETE | `/api/tasks/{id}` | Delete a task | ADMIN |
| GET | `/api/tasks/{id}/comments` | List comments on a task | Required |
| POST | `/api/tasks/{id}/comments` | Add a comment | Required |
| GET | `/api/notifications` | Get current user notifications | Required |
| GET | `/api/users` | List users | ADMIN |
| GET | `/api/profile` | Get current user profile | Required |
| PUT | `/api/profile` | Update current user profile | Required |
| POST | `/api/ai/generate-description` | Generate task description (mock) | Required |
| POST | `/api/ai/suggest-priority` | Suggest task priority (mock) | Required |
| POST | `/api/ai/summarize` | Summarize task content (mock) | Required |
| GET | `/api/health` | Health check | Public |

> All protected endpoints require the header: `Authorization: Bearer <token>`

---

## Swagger UI

Once the backend is running, the full interactive API documentation is available at:

```
http://localhost:8080/swagger-ui.html
```

The raw OpenAPI spec is at:

```
http://localhost:8080/v3/api-docs
```

---

## Installation

### Prerequisites

- Java 21
- Maven 3.9+
- Node.js 18+
- MySQL 8+

---

### Backend

```bash
cd backend
```

Create the database (or let Hibernate auto-create it on first run):

```sql
CREATE DATABASE task_manager_db;
```

Copy the example env file and set your values:

```bash
cp .env.example .env
```

```env
DB_URL=jdbc:mysql://localhost:3306/task_manager_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
JWT_SECRET=your-strong-random-secret
JWT_EXPIRATION_MS=86400000
```

> The app falls back to `root/root` and a placeholder JWT secret if no `.env` is set — fine for local dev, not for any deployed environment.

Run the application:

```bash
mvn spring-boot:run
```

The API will be available at `http://localhost:8080`.

---

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The UI will be available at `http://localhost:5173`.

By default, the frontend expects the backend at `http://localhost:8080`. Update the base URL in `src/services/api.ts` if your backend runs elsewhere.

---

### Running Tests

```bash
cd backend
mvn test
```

---

## Screenshots

> _Screenshots will be added once the UI is finalized._

| Page | Description |
|------|-------------|
| Login / Register | Authentication page |
| Dashboard | Overview of projects and tasks |
| Projects | Project list and detail view |
| Tasks | Task list, detail, and comment thread |

---

## AI Integration

The backend includes an `AiService` backed by a pluggable `AiProvider` interface. The current implementation is a `MockAiProvider` that returns static responses — no external API calls, no credentials required.

**Supported operations (mock):**
- `POST /api/ai/generate-description` — generate a task description from a title
- `POST /api/ai/suggest-priority` — suggest a priority level for a task
- `POST /api/ai/summarize` — summarize task content

**To connect a real provider:**

1. Implement the `AiProvider` interface in a new class (e.g. `BedrockAiProvider`)
2. Register it as a Spring bean
3. Update `ai.provider` in `application.yml`
4. Add the required credentials/config

The rest of the codebase does not need to change. AWS Bedrock is a natural fit given the Spring Boot stack, but the interface is provider-agnostic.

---

## Roadmap

- [ ] Connect AI endpoints to a real provider (AWS Bedrock)
- [ ] File attachments on tasks
- [ ] Real-time notifications via WebSocket
- [ ] Activity/audit log per project
- [ ] Pagination and filtering on task and project list endpoints
- [ ] Docker Compose setup for local development
- [ ] CI/CD pipeline configuration
- [ ] Frontend unit and integration tests

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 21, Spring Boot 3.3, Spring Security, Spring Data JPA |
| Database | MySQL 8 |
| Auth | JWT (jjwt 0.12) |
| API Docs | SpringDoc OpenAPI 2.5 / Swagger UI |
| Frontend | React 18, TypeScript, Vite 5 |
| Styling | Tailwind CSS 3 |
| Forms | React Hook Form + Zod |
| HTTP Client | Axios |

---

## License

MIT
