'use server';

import type { TaskState } from '@/src/entities/task';
import type { ActionResult } from '@/src/shared/config';
import { readLocale, type Locale } from '@/src/shared/i18n';
import {
  authorizedFetch,
  redirectIfUnauthorized,
  revalidateLocalizedPaths,
} from '@/src/shared/lib/session';
import { taskPath } from '@/src/shared/utils/api';

export async function changeTaskStatusAction(
  id: string,
  taskListId: string,
  state: TaskState,
  localeValue: Locale | string,
): Promise<NonNullable<ActionResult>> {
  const locale = readLocale(localeValue);

  if (!id || !taskListId) {
    return { error: 'validation.invalidStatusData' };
  }

  const response = await authorizedFetch(taskPath(id), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ state }),
  });

  redirectIfUnauthorized(response, locale);

  if (!response.ok) {
    return { error: 'error.changeStatusFailed' };
  }

  revalidateLocalizedPaths([`/tasks/${id}`, `/lists/${taskListId}`, '/lists']);
  return { success: true };
}
