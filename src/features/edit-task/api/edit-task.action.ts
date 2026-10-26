'use server';

import { getTranslations } from 'next-intl/server';
import { apiUrl } from '@/src/shared/config';
import { revalidateLocalizedPath } from '@/src/shared/lib/i18n/revalidate-localized-path';

export type EditTaskActionState = {
  error?: string;
  success?: boolean;
} | null;

export async function editTaskAction(
  _prevState: EditTaskActionState,
  formData: FormData,
): Promise<EditTaskActionState> {
  const t = await getTranslations();
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
    return { error: t('validation.fillAllFields') };
  }

  const response = await fetch(apiUrl(`/api/data/tasks/${id}`), {
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

  if (!response.ok) {
    return { error: t('errors.updateTaskFailed') };
  }

  await revalidateLocalizedPath(`/tasks/${id}`);
  await revalidateLocalizedPath(`/lists/${taskListId}`);
  await revalidateLocalizedPath('/lists');
  return { success: true };
}
