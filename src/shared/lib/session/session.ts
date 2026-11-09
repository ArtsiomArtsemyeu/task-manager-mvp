import 'server-only';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { apiUrl } from '@/src/shared/config';
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

export function redirectIfUnauthorized(response: Response): void {
  if (response.status === 401) {
    redirect('/');
  }
}
