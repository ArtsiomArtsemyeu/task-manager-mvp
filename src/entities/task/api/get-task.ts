import 'server-only';

import type { TaskDto } from '../model/task-dto.model';
import { API_PATHS, apiFetch } from '@/src/shared/config';
import { HttpError } from '@/src/shared/lib/http-error';

export async function getTask(id: string): Promise<TaskDto> {
  const response = await apiFetch(API_PATHS.task(id), {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new HttpError(response.status);
  }

  return response.json() as Promise<TaskDto>;
}
