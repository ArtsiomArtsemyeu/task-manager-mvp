import 'server-only';

import type { TaskDto } from '../model/task-dto.model';
import { HttpError } from '@/src/shared/lib/http-error';
import { authorizedFetch } from '@/src/shared/lib/session';
import { taskPath } from '@/src/shared/utils/api';

export async function getTask(id: string): Promise<TaskDto> {
  const response = await authorizedFetch(taskPath(id), {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new HttpError(response.status);
  }

  return response.json() as Promise<TaskDto>;
}
