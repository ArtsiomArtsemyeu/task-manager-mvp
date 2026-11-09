export function loginPath(): string {
  return '/api/auth/login';
}

export function tasksPath(): string {
  return '/api/data/tasks';
}

export function taskPath(id: string): string {
  return `/api/data/tasks/${id}`;
}

export function taskListsPath(): string {
  return '/api/data/task-lists';
}

export function taskListPath(id: string): string {
  return `/api/data/task-lists/${id}`;
}
