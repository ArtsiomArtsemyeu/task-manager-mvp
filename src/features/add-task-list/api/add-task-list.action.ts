'use server';

import { getTranslations } from 'next-intl/server';
import { API_PATHS, apiFetch } from '@/src/shared/config';
import { revalidateLocalizedPath } from '@/src/shared/lib/i18n/revalidate-localized-path';

export type AddTaskListActionState = {
  error?: string;
  success?: boolean;
} | null;

export async function addTaskListAction(
  _prevState: AddTaskListActionState,
  formData: FormData,
): Promise<AddTaskListActionState> {
  const t = await getTranslations();
  const name = formData.get('name');

  if (typeof name !== 'string' || !name.trim()) {
    return { error: t('validation.nameRequired') };
  }

  const response = await apiFetch(API_PATHS.taskLists, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: name.trim() }),
  });

  if (!response.ok) {
    return { error: t('validation.invalidListName') };
  }

  await revalidateLocalizedPath('/lists');
  return { success: true };
}
