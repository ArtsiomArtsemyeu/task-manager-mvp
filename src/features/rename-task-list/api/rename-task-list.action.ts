'use server';

import type { ActionResult } from '@/src/shared/config';
import { readLocale } from '@/src/shared/i18n';
import {
  authorizedFetch,
  redirectIfUnauthorized,
  revalidateLocalizedPaths,
} from '@/src/shared/lib/session';
import { taskListPath } from '@/src/shared/utils/api';

export type RenameTaskListActionState = ActionResult;

export async function renameTaskListAction(
  localeValue: string,
  _prevState: RenameTaskListActionState,
  formData: FormData,
): Promise<RenameTaskListActionState> {
  const locale = readLocale(localeValue);
  const id = formData.get('id');
  const name = formData.get('name');

  if (typeof id !== 'string' || !id) {
    return { error: 'validation.invalidTaskListId' };
  }

  if (typeof name !== 'string' || !name.trim()) {
    return { error: 'validation.nameRequired' };
  }

  const response = await authorizedFetch(taskListPath(id), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: name.trim() }),
  });

  redirectIfUnauthorized(response, locale);

  if (!response.ok) {
    return { error: 'error.renameTaskListFailed' };
  }

  revalidateLocalizedPaths(['/lists']);
  return { success: true };
}
