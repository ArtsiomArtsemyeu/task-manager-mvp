import 'server-only';

import type { TaskListDto } from '../model/task-list-dto.model';
import { API_PATHS, apiFetch } from '@/src/shared/config';
import { HttpError } from '@/src/shared/lib/http-error';

export async function getTaskLists(): Promise<TaskListDto[]> {
  const response = await apiFetch(API_PATHS.taskLists, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new HttpError(response.status);
  }

  return response.json() as Promise<TaskListDto[]>;
}
