import axios, { AxiosError } from 'axios';
import { TOKEN_STORAGE_KEY, clearAuthStorage } from './auth';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request: attach JWT ──────────────────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Response: normalise errors ───────────────────────────────────────────────
api.interceptors.response.use(
  (res) => res,
  (error: AxiosError<{ message?: string; errors?: Record<string, string> }>) => {
    if (error.response?.status === 401) {
      clearAuthStorage();
      window.location.assign('/login');
    }
    // Attach a human-readable message so hooks can surface it directly
    const serverMsg = error.response?.data?.message;
    const validationErrors = error.response?.data?.errors;
    const message =
      serverMsg ??
      (validationErrors ? Object.values(validationErrors).join(', ') : null) ??
      error.message ??
      'An unexpected error occurred.';
    return Promise.reject(new Error(message));
  },
);
