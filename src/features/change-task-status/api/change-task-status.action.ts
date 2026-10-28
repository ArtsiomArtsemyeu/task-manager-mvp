'use server';

import { getTranslations } from 'next-intl/server';
import type { TaskState } from '@/src/entities/task';
import { API_PATHS, apiFetch } from '@/src/shared/config';
import { revalidateLocalizedPath } from '@/src/shared/lib/i18n/revalidate-localized-path';

export async function changeTaskStatusAction(
  id: string,
  taskListId: string,
  state: TaskState,
): Promise<{ error?: string; success?: boolean }> {
  const t = await getTranslations();

  if (!id || !taskListId) {
    return { error: t('validation.invalidStatusData') };
  }

  const response = await apiFetch(API_PATHS.task(id), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ state }),
  });

  if (!response.ok) {
    return { error: t('errors.changeStatusFailed') };
  }

  await revalidateLocalizedPath(`/tasks/${id}`);
  await revalidateLocalizedPath(`/lists/${taskListId}`);
  await revalidateLocalizedPath('/lists');
  return { success: true };
}
