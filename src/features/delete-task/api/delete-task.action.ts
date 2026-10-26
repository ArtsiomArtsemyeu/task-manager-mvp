'use server';

import { getLocale, getTranslations } from 'next-intl/server';
import { redirect } from '@/src/i18n/navigation';
import { apiUrl } from '@/src/shared/config';
import { revalidateLocalizedPath } from '@/src/shared/lib/i18n/revalidate-localized-path';

export type DeleteTaskActionState = {
  error?: string;
  success?: boolean;
} | null;

export async function deleteTaskAction(
  _prevState: DeleteTaskActionState,
  formData: FormData,
): Promise<DeleteTaskActionState> {
  const t = await getTranslations();
  const id = formData.get('id');
  const taskListId = formData.get('taskListId');
  const redirectTo = formData.get('redirectTo');

  if (
    typeof id !== 'string' ||
    typeof taskListId !== 'string' ||
    !id ||
    !taskListId
  ) {
    return { error: t('validation.invalidTaskData') };
  }

  const response = await fetch(apiUrl(`/api/data/tasks/${id}`), {
    method: 'DELETE',
  });

  if (!response.ok) {
    return { error: t('errors.deleteTaskFailed') };
  }

  await revalidateLocalizedPath(`/tasks/${id}`);
  await revalidateLocalizedPath(`/lists/${taskListId}`);
  await revalidateLocalizedPath('/lists');

  if (typeof redirectTo === 'string' && redirectTo.startsWith('/')) {
    const locale = await getLocale();
    redirect({ href: redirectTo, locale });
  }

  return { success: true };
}
