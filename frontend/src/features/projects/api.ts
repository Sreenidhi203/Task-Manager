import { api } from '@/services/api';
import type { ProjectItem, ProjectListResponse, ProjectPayload } from './types';

export const getProjects = (params: Record<string, string | number | undefined>) =>
  api.get<ProjectListResponse>('/v1/projects', { params });

export const getProjectById = (id: number) =>
  api.get<ProjectItem>(`/v1/projects/${id}`);

export const createProject = (payload: ProjectPayload) =>
  api.post<ProjectItem>('/v1/projects', payload);

export const updateProject = (id: number, payload: ProjectPayload) =>
  api.put<ProjectItem>(`/v1/projects/${id}`, payload);

export const deleteProject = (id: number) =>
  api.delete(`/v1/projects/${id}`);
