import 'server-only';

import type { TaskListDto } from '../model/task-list-dto.model';
import { HttpError } from '@/src/shared/lib/http-error';
import { authorizedFetch } from '@/src/shared/lib/session';
import { taskListsPath } from '@/src/shared/utils/api';

export async function getTaskLists(): Promise<TaskListDto[]> {
  const response = await authorizedFetch(taskListsPath(), {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new HttpError(response.status);
  }

  return response.json() as Promise<TaskListDto[]>;
}