'use server';

import { revalidatePath } from 'next/cache';
import { apiUrl, errorMessages } from '@/src/shared/config';

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

  const response = await fetch(apiUrl(`/api/data/task-lists/${id}`), {
    method: 'DELETE',
  });

  if (!response.ok) {
    return { error: errorMessages.error.deleteTaskListFailed };
  }

  revalidatePath('/lists');
  return { success: true };
}
