import { getRequiredEnv } from '@/src/shared/config/env';

export const API_PATHS = {
  authLogin: '/api/auth/login',
  taskLists: '/api/data/task-lists',
  taskList: (id: string) => `/api/data/task-lists/${id}`,
  tasks: '/api/data/tasks',
  task: (id: string) => `/api/data/tasks/${id}`,
} as const;

export function apiUrl(path: string): string {
  const apiBaseUrl = getRequiredEnv('APP_BASE_URL');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${apiBaseUrl}${normalizedPath}`;
}
