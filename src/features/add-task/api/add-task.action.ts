'use server';

import { getTranslations } from 'next-intl/server';
import { API_PATHS, apiFetch } from '@/src/shared/config';
import { revalidateLocalizedPath } from '@/src/shared/lib/i18n/revalidate-localized-path';

export type AddTaskActionState = {
  error?: string;
  success?: boolean;
} | null;

export async function addTaskAction(
  _prevState: AddTaskActionState,
  formData: FormData,
): Promise<AddTaskActionState> {
  const t = await getTranslations();
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
    return { error: t('validation.fillAllFields') };
  }

  const response = await apiFetch(API_PATHS.tasks, {
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

  if (!response.ok) {
    return { error: t('errors.createTaskFailed') };
  }

  await revalidateLocalizedPath(`/lists/${taskListId}`);
  await revalidateLocalizedPath('/lists');
  return { success: true };
}
