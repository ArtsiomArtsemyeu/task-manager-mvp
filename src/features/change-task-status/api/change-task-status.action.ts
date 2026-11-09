'use server';

import { revalidatePath } from 'next/cache';
import type { TaskState } from '@/src/entities/task';
import { errorMessages } from '@/src/shared/config';
import {
  authorizedFetch,
  redirectIfUnauthorized,
} from '@/src/shared/lib/session';
import { taskPath } from '@/src/shared/utils/api';

export async function changeTaskStatusAction(
  id: string,
  taskListId: string,
  state: TaskState,
): Promise<{ error?: string; success?: boolean }> {
  if (!id || !taskListId) {
    return { error: errorMessages.validation.invalidStatusData };
  }

  const response = await authorizedFetch(taskPath(id), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ state }),
  });

  redirectIfUnauthorized(response);

  if (!response.ok) {
    return { error: errorMessages.error.changeStatusFailed };
  }

  revalidatePath(`/tasks/${id}`);
  revalidatePath(`/lists/${taskListId}`);
  revalidatePath('/lists');
  return { success: true };
}
