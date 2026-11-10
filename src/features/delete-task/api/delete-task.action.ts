'use server';

import type { ActionResult } from '@/src/shared/config';
import { readLocale, redirect } from '@/src/shared/i18n';
import {
  authorizedFetch,
  redirectIfUnauthorized,
  revalidateLocalizedPaths,
} from '@/src/shared/lib/session';
import { taskPath } from '@/src/shared/utils/api';

export type DeleteTaskActionState = ActionResult;

export async function deleteTaskAction(
  localeValue: string,
  _prevState: DeleteTaskActionState,
  formData: FormData,
): Promise<DeleteTaskActionState> {
  const locale = readLocale(localeValue);
  const id = formData.get('id');
  const taskListId = formData.get('taskListId');
  const redirectTo = formData.get('redirectTo');

  if (
    typeof id !== 'string' ||
    typeof taskListId !== 'string' ||
    !id ||
    !taskListId
  ) {
    return { error: 'validation.invalidTaskData' };
  }

  const response = await authorizedFetch(taskPath(id), {
    method: 'DELETE',
  });

  redirectIfUnauthorized(response, locale);

  if (!response.ok) {
    return { error: 'error.deleteTaskFailed' };
  }

  revalidateLocalizedPaths([`/tasks/${id}`, `/lists/${taskListId}`, '/lists']);

  if (typeof redirectTo === 'string' && redirectTo.startsWith('/')) {
    redirect({ href: redirectTo, locale });
  }

  return { success: true };
}
