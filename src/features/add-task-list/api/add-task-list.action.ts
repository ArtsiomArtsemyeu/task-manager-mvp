'use server';

import type { ActionResult } from '@/src/shared/config';
import { readLocale } from '@/src/shared/i18n';
import {
  authorizedFetch,
  redirectIfUnauthorized,
  revalidateLocalizedPaths,
} from '@/src/shared/lib/session';
import { taskListsPath } from '@/src/shared/utils/api';

export type AddTaskListActionState = ActionResult;

export async function addTaskListAction(
  localeValue: string,
  _prevState: AddTaskListActionState,
  formData: FormData,
): Promise<AddTaskListActionState> {
  const locale = readLocale(localeValue);
  const name = formData.get('name');

  if (typeof name !== 'string' || !name.trim()) {
    return { error: 'validation.nameRequired' };
  }

  const response = await authorizedFetch(taskListsPath(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: name.trim() }),
  });

  redirectIfUnauthorized(response, locale);

  if (!response.ok) {
    return { error: 'validation.invalidListName' };
  }

  revalidateLocalizedPaths(['/lists']);
  return { success: true };
}
