'use server';

import { revalidatePath } from 'next/cache';
import { errorMessages } from '@/src/shared/config';
import {
  authorizedFetch,
  redirectIfUnauthorized,
} from '@/src/shared/lib/session';
import { taskListPath } from '@/src/shared/utils/api';

export type DeleteTaskListActionState = {
  error?: string;
  success?: boolean;
} | null;

export async function deleteTaskListAction(
  _prevState: DeleteTaskListActionState,
  formData: FormData,
): Promise<DeleteTaskListActionState> {
  const id = formData.get('id');

  if (typeof id !== 'string' || !id) {
    return { error: errorMessages.validation.invalidTaskListId };
  }

  const response = await authorizedFetch(taskListPath(id), {
    method: 'DELETE',
  });

  redirectIfUnauthorized(response);

  if (!response.ok) {
    return { error: errorMessages.error.deleteTaskListFailed };
  }

  revalidatePath('/lists');
  return { success: true };
}
