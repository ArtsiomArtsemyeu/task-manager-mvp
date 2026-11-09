import 'server-only';

import type { TaskListDto } from '../model/task-list-dto.model';
import { HttpError } from '@/src/shared/lib/http-error';
import { authorizedFetch } from '@/src/shared/lib/session';
import { taskListPath } from '@/src/shared/utils/api';

export async function getTaskList(id: string): Promise<TaskListDto> {
  const response = await authorizedFetch(taskListPath(id), {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new HttpError(response.status);
  }

  return response.json() as Promise<TaskListDto>;
}
