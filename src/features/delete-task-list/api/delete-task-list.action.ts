'use server';

import { getTranslations } from 'next-intl/server';
import { apiUrl } from '@/src/shared/config';
import { revalidateLocalizedPath } from '@/src/shared/lib/i18n/revalidate-localized-path';

export type DeleteTaskListActionState = {
  error?: string;
  success?: boolean;
} | null;

export async function deleteTaskListAction(
  _prevState: DeleteTaskListActionState,
  formData: FormData,
): Promise<DeleteTaskListActionState> {
  const t = await getTranslations();
  const id = formData.get('id');

  if (typeof id !== 'string' || !id) {
    return { error: t('validation.invalidTaskListId') };
  }

  const response = await fetch(apiUrl(`/api/data/task-lists/${id}`), {
    method: 'DELETE',
  });

  if (!response.ok) {
    return { error: t('errors.deleteTaskListFailed') };
  }

  await revalidateLocalizedPath('/lists');
  return { success: true };
}
