import api from './client';

// ── Types ────────────────────────────────────────────────────────────────────

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  userId: number;
  email: string;
  role: string;
  expiresIn: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
  active: boolean;
  createdAt: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  ownerId: number;
  status: string;
  taskCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  projectId: number;
  projectName: string;
  assigneeId: number | null;
  status: string;
  priority: string;
  dueDate: string | null;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: number;
  content: string;
  taskId: number;
  authorId: number;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  register: (data: { username: string; email: string; password: string; fullName: string; role?: string }) =>
    api.post<AuthResponse>('/api/auth/register', data).then(r => r.data),

  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/api/auth/login', data).then(r => r.data),
};

// ── Users ─────────────────────────────────────────────────────────────────────

export const usersApi = {
  list: (params?: Record<string, unknown>) =>
    api.get<PageResponse<User>>('/api/users', { params }).then(r => r.data),

  getById: (id: number) =>
    api.get<User>(`/api/users/${id}`).then(r => r.data),

  profile: () =>
    api.get<User>('/api/profile').then(r => r.data),

  updateProfile: (data: Partial<User>) =>
    api.put<User>('/api/profile', data).then(r => r.data),

  update: (id: number, data: Partial<User>) =>
    api.put<User>(`/api/users/${id}`, data).then(r => r.data),

  delete: (id: number) =>
    api.delete(`/api/users/${id}`),
};

// ── Projects ──────────────────────────────────────────────────────────────────

export const projectsApi = {
  list: (params?: Record<string, unknown>) =>
    api.get<PageResponse<Project>>('/api/projects', { params }).then(r => r.data),

  getById: (id: number) =>
    api.get<Project>(`/api/projects/${id}`).then(r => r.data),

  create: (data: { name: string; description?: string; status?: string }) =>
    api.post<Project>('/api/projects', data).then(r => r.data),

  update: (id: number, data: Partial<Project>) =>
    api.put<Project>(`/api/projects/${id}`, data).then(r => r.data),

  delete: (id: number) =>
    api.delete(`/api/projects/${id}`),
};

// ── Tasks ─────────────────────────────────────────────────────────────────────

export const tasksApi = {
  list: (params?: Record<string, unknown>) =>
    api.get<PageResponse<Task>>('/api/tasks', { params }).then(r => r.data),

  getById: (id: number) =>
    api.get<Task>(`/api/tasks/${id}`).then(r => r.data),

  create: (data: { title: string; projectId: number; description?: string; priority?: string; dueDate?: string }) =>
    api.post<Task>('/api/tasks', data).then(r => r.data),

  update: (id: number, data: Partial<Task>) =>
    api.put<Task>(`/api/tasks/${id}`, data).then(r => r.data),

  assign: (id: number, assigneeId: number) =>
    api.patch<Task>(`/api/tasks/${id}/assign`, null, { params: { assigneeId } }).then(r => r.data),

  delete: (id: number) =>
    api.delete(`/api/tasks/${id}`),

  getComments: (taskId: number, params?: Record<string, unknown>) =>
    api.get<PageResponse<Comment>>(`/api/tasks/${taskId}/comments`, { params }).then(r => r.data),

  addComment: (taskId: number, content: string) =>
    api.post<Comment>(`/api/tasks/${taskId}/comments`, { content }).then(r => r.data),

  deleteComment: (taskId: number, commentId: number) =>
    api.delete(`/api/tasks/${taskId}/comments/${commentId}`),
};

// ── Notifications ─────────────────────────────────────────────────────────────

export const notificationsApi = {
  list: (params?: Record<string, unknown>) =>
    api.get<PageResponse<Notification>>('/api/notifications', { params }).then(r => r.data),

  unreadCount: () =>
    api.get<{ count: number }>('/api/notifications/unread-count').then(r => r.data),

  markRead: (id: number) =>
    api.patch(`/api/notifications/${id}/read`),

  markAllRead: () =>
    api.patch('/api/notifications/read-all'),
};
