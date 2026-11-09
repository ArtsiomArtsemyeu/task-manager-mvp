'use server';

import { revalidatePath } from 'next/cache';
import { errorMessages } from '@/src/shared/config';
import {
  authorizedFetch,
  redirectIfUnauthorized,
} from '@/src/shared/lib/session';
import { taskListPath } from '@/src/shared/utils/api';

export type RenameTaskListActionState = {
  error?: string;
  success?: boolean;
} | null;

export async function renameTaskListAction(
  _prevState: RenameTaskListActionState,
  formData: FormData,
): Promise<RenameTaskListActionState> {
  const id = formData.get('id');
  const name = formData.get('name');

  if (typeof id !== 'string' || !id) {
    return { error: errorMessages.validation.invalidTaskListId };
  }

  if (typeof name !== 'string' || !name.trim()) {
    return { error: errorMessages.validation.nameRequired };
  }

  const response = await authorizedFetch(taskListPath(id), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: name.trim() }),
  });

  redirectIfUnauthorized(response);

  if (!response.ok) {
    return { error: errorMessages.error.renameTaskListFailed };
  }

  revalidatePath('/lists');
  return { success: true };
}
