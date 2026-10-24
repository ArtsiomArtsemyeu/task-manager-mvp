import 'server-only';

import type { TaskListDto } from '../model/task-list-dto.model';
import { apiUrl } from '@/src/shared/config';
import { HttpError } from '@/src/shared/lib/http-error';

export function getTaskList(id: string): Promise<TaskListDto> {
  return fetch(apiUrl(`/api/data/task-lists/${id}`), {
    cache: 'no-store',
  }).then((response: Response) => {
    if (!response.ok) {
      throw new HttpError(response.status);
    }

    return response.json() as Promise<TaskListDto>;
  });
}
