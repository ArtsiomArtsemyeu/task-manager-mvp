'use server';

import type { ActionResult } from '@/src/shared/config';
import { readLocale } from '@/src/shared/i18n';
import {
  authorizedFetch,
  redirectIfUnauthorized,
  revalidateLocalizedPaths,
} from '@/src/shared/lib/session';
import { taskPath } from '@/src/shared/utils/api';

export type EditTaskActionState = ActionResult;

export async function editTaskAction(
  localeValue: string,
  _prevState: EditTaskActionState,
  formData: FormData,
): Promise<EditTaskActionState> {
  const locale = readLocale(localeValue);
  const id = formData.get('id');
  const name = formData.get('name');
  const state = formData.get('state');
  const dueDate = formData.get('dueDate');
  const taskListId = formData.get('taskListId');
  const description = formData.get('description');
  const priority = Number(formData.get('priority'));

  if (
    typeof id !== 'string' ||
    typeof taskListId !== 'string' ||
    typeof name !== 'string' ||
    typeof description !== 'string' ||
    typeof state !== 'string' ||
    typeof dueDate !== 'string' ||
    !id ||
    !taskListId ||
    !name.trim() ||
    !state ||
    Number.isNaN(priority) ||
    !dueDate
  ) {
    return { error: 'validation.fillAllFields' };
  }

  const response = await authorizedFetch(taskPath(id), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: name.trim(),
      description: description.trim(),
      state,
      priority,
      dueDate: new Date(dueDate).toISOString(),
    }),
  });

  redirectIfUnauthorized(response, locale);

  if (!response.ok) {
    return { error: 'error.updateTaskFailed' };
  }

  revalidateLocalizedPaths([`/tasks/${id}`, `/lists/${taskListId}`, '/lists']);
  return { success: true };
}
