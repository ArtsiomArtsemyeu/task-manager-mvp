import 'server-only';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { apiUrl } from '@/src/shared/config';
import { redirect, routing, type Locale } from '@/src/shared/i18n';
import { SESSION_COOKIE_NAME } from '@/src/shared/utils/jwt';

export async function authorizedFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const headers = new Headers(init.headers);
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetch(apiUrl(path), {
    ...init,
    headers,
  });
}

export function redirectIfUnauthorized(
  response: Response,
  locale: Locale,
): void {
  if (response.status !== 401) {
    return;
  }

  redirect({ href: '/', locale });
}

export function revalidateLocalizedPaths(pathnames: readonly string[]): void {
  for (const pathname of pathnames) {
    for (const locale of routing.locales) {
      revalidatePath(`/${locale}${pathname}`);
    }
  }
}
