'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { errorMessages } from '@/src/shared/config';
import {
  authorizedFetch,
  redirectIfUnauthorized,
} from '@/src/shared/lib/session';
import { taskPath } from '@/src/shared/utils/api';

export type DeleteTaskActionState = {
  error?: string;
  success?: boolean;
} | null;

export async function deleteTaskAction(
  _prevState: DeleteTaskActionState,
  formData: FormData,
): Promise<DeleteTaskActionState> {
  const id = formData.get('id');
  const taskListId = formData.get('taskListId');
  const redirectTo = formData.get('redirectTo');

  if (
    typeof id !== 'string' ||
    typeof taskListId !== 'string' ||
    !id ||
    !taskListId
  ) {
    return { error: errorMessages.validation.invalidTaskData };
  }

  const response = await authorizedFetch(taskPath(id), {
    method: 'DELETE',
  });

  redirectIfUnauthorized(response);

  if (!response.ok) {
    return { error: errorMessages.error.deleteTaskFailed };
  }

  revalidatePath(`/tasks/${id}`);
  revalidatePath(`/lists/${taskListId}`);
  revalidatePath('/lists');

  if (typeof redirectTo === 'string' && redirectTo.startsWith('/')) {
    redirect(redirectTo);
  }

  return { success: true };
}
