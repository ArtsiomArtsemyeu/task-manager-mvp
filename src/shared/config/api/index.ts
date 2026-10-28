import 'server-only';

import { cookies } from 'next/headers';
import { API_PATHS, apiUrl } from '@/src/shared/utils/api';
import { SESSION_COOKIE_NAME } from '@/src/shared/utils/jwt';

export { API_PATHS, apiUrl };

export async function apiFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const headers = new Headers(init?.headers);

  if (token) {
    headers.set('Cookie', `${SESSION_COOKIE_NAME}=${token}`);
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetch(apiUrl(path), {
    ...init,
    headers,
  });
}
