'use server';

import type { ActionResult } from '@/src/shared/config';
import { readLocale } from '@/src/shared/i18n';
import {
  authorizedFetch,
  redirectIfUnauthorized,
  revalidateLocalizedPaths,
} from '@/src/shared/lib/session';
import { tasksPath } from '@/src/shared/utils/api';

export type AddTaskActionState = ActionResult;

export async function addTaskAction(
  localeValue: string,
  _prevState: AddTaskActionState,
  formData: FormData,
): Promise<AddTaskActionState> {
  const locale = readLocale(localeValue);
  const taskListId = formData.get('taskListId');
  const name = formData.get('name');
  const description = formData.get('description');
  const state = formData.get('state');
  const priority = Number(formData.get('priority'));
  const dueDate = formData.get('dueDate');

  if (
    typeof taskListId !== 'string' ||
    typeof name !== 'string' ||
    typeof description !== 'string' ||
    typeof state !== 'string' ||
    typeof dueDate !== 'string' ||
    !taskListId ||
    !name.trim() ||
    !state ||
    Number.isNaN(priority) ||
    !dueDate
  ) {
    return { error: 'validation.fillAllFields' };
  }

  const response = await authorizedFetch(tasksPath(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      taskListId,
      name: name.trim(),
      description: description.trim(),
      state,
      priority,
      dueDate: new Date(dueDate).toISOString(),
    }),
  });

  redirectIfUnauthorized(response, locale);

  if (!response.ok) {
    return { error: 'error.createTaskFailed' };
  }

  revalidateLocalizedPaths([`/lists/${taskListId}`, '/lists']);
  return { success: true };
}
