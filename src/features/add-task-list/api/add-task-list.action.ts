'use server';

import { revalidatePath } from 'next/cache';
import { errorMessages } from '@/src/shared/config';
import {
  authorizedFetch,
  redirectIfUnauthorized,
} from '@/src/shared/lib/session';
import { taskListsPath } from '@/src/shared/utils/api';

export type AddTaskListActionState = {
  error?: string;
  success?: boolean;
} | null;

export async function addTaskListAction(
  _prevState: AddTaskListActionState,
  formData: FormData,
): Promise<AddTaskListActionState> {
  const name = formData.get('name');

  if (typeof name !== 'string' || !name.trim()) {
    return { error: errorMessages.validation.nameRequired };
  }

  const response = await authorizedFetch(taskListsPath(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: name.trim() }),
  });

  redirectIfUnauthorized(response);

  if (!response.ok) {
    return { error: errorMessages.validation.invalidListName };
  }

  revalidatePath('/lists');
  return { success: true };
}
