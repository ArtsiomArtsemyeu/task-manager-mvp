'use server';

import { getTranslations } from 'next-intl/server';
import { apiUrl } from '@/src/shared/config';
import { revalidateLocalizedPath } from '@/src/shared/lib/i18n/revalidate-localized-path';

export type RenameTaskListActionState = {
  error?: string;
  success?: boolean;
} | null;

export async function renameTaskListAction(
  _prevState: RenameTaskListActionState,
  formData: FormData,
): Promise<RenameTaskListActionState> {
  const t = await getTranslations();
  const id = formData.get('id');
  const name = formData.get('name');

  if (typeof id !== 'string' || !id) {
    return { error: t('validation.invalidTaskListId') };
  }

  if (typeof name !== 'string' || !name.trim()) {
    return { error: t('validation.nameRequired') };
  }

  const response = await fetch(apiUrl(`/api/data/task-lists/${id}`), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: name.trim() }),
  });

  if (!response.ok) {
    return { error: t('errors.renameTaskListFailed') };
  }

  await revalidateLocalizedPath('/lists');
  return { success: true };
}
