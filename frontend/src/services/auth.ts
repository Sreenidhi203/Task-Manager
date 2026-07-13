import { api } from './api';
import type { AuthResponse, AuthUser } from '@/types/auth';

export const TOKEN_STORAGE_KEY = 'task-manager-token';
export const USER_STORAGE_KEY = 'task-manager-user';

export async function login(email: string, password: string) {
  return api.post<AuthResponse>('/auth/login', { email, password });
}

export async function register(payload: Record<string, unknown>) {
  return api.post<AuthResponse>('/auth/register', payload);
}

export function persistAuth(auth: AuthResponse, user: AuthUser) {
  localStorage.setItem(TOKEN_STORAGE_KEY, auth.token);
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

export function getStoredAuth() {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  const user = localStorage.getItem(USER_STORAGE_KEY);

  if (!token || !user) {
    return null;
  }

  return { token, user: JSON.parse(user) as AuthUser };
}

export function clearAuthStorage() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
}
