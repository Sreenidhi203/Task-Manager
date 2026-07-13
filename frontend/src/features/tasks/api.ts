import { api } from '@/services/api';
import type { TaskItem, TaskListResponse } from './types';

export async function getTasks(params: Record<string, string | number | undefined>) {
  return api.get<TaskListResponse>('/tasks', { params });
}

export async function getTaskById(id: number) {
  return api.get<TaskItem>(`/tasks/${id}`);
}

export async function createTask(payload: Record<string, unknown>) {
  return api.post<TaskItem>('/tasks', payload);
}

export async function updateTask(id: number, payload: Record<string, unknown>) {
  return api.put<TaskItem>(`/tasks/${id}`, payload);
}

export async function deleteTask(id: number) {
  return api.delete(`/tasks/${id}`);
}

export async function assignTask(id: number, assigneeId: number) {
  return api.post<TaskItem>(`/tasks/${id}/assign`, null, { params: { assigneeId } });
}
