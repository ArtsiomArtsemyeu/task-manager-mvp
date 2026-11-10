'use server';

import type { ActionResult } from '@/src/shared/config';
import { readLocale } from '@/src/shared/i18n';
import {
  authorizedFetch,
  redirectIfUnauthorized,
  revalidateLocalizedPaths,
} from '@/src/shared/lib/session';
import { taskListPath } from '@/src/shared/utils/api';

export type DeleteTaskListActionState = ActionResult;

export async function deleteTaskListAction(
  localeValue: string,
  _prevState: DeleteTaskListActionState,
  formData: FormData,
): Promise<DeleteTaskListActionState> {
  const locale = readLocale(localeValue);
  const id = formData.get('id');

  if (typeof id !== 'string' || !id) {
    return { error: 'validation.invalidTaskListId' };
  }

  const response = await authorizedFetch(taskListPath(id), {
    method: 'DELETE',
  });

  redirectIfUnauthorized(response, locale);

  if (!response.ok) {
    return { error: 'error.deleteTaskListFailed' };
  }

  revalidateLocalizedPaths(['/lists']);
  return { success: true };
}
