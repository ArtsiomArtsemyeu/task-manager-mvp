'use server';

import { cookies } from 'next/headers';
import type { ActionResult } from '@/src/shared/config';
import { apiUrl } from '@/src/shared/config';
import { readLocale, redirect } from '@/src/shared/i18n';
import { loginPath } from '@/src/shared/utils/api';
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  createToken,
} from '@/src/shared/utils/jwt';
import { isRecord, readJson } from '@/src/shared/utils/type-guard';

export type LoginActionState = ActionResult;

export async function loginAction(
  localeValue: string,
  _prevState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const locale = readLocale(localeValue);
  const email = formData.get('email');
  const password = formData.get('password');

  const response = await fetch(apiUrl(loginPath()), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    return { error: 'error.invalidCredentials' };
  }

  const body = await readJson(response);

  const payload = isRecord(body) ? body.userSessionPayload : undefined;

  if (
    !isRecord(payload) ||
    typeof payload.userId !== 'string' ||
    typeof payload.email !== 'string'
  ) {
    return { error: 'error.loginFailed' };
  }

  const jwtToken = createToken({
    userId: payload.userId,
    email: payload.email,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, jwtToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  redirect({ href: '/lists', locale });
  return null;
}
