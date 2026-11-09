'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { apiUrl, errorMessages } from '@/src/shared/config';
import { loginPath } from '@/src/shared/utils/api';
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  createToken,
} from '@/src/shared/utils/jwt';
import { isRecord, readJson } from '@/src/shared/utils/type-guard';

export type LoginActionState = {
  error?: string;
  success?: boolean;
} | null;

export async function loginAction(
  _prevState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const email = formData.get('email');
  const password = formData.get('password');

  const response = await fetch(apiUrl(loginPath()), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    return { error: errorMessages.error.invalidCredentials };
  }

  const body = await readJson(response);

  const payload = isRecord(body) ? body.userSessionPayload : undefined;

  if (
    !isRecord(payload) ||
    typeof payload.userId !== 'string' ||
    typeof payload.email !== 'string'
  ) {
    return { error: errorMessages.error.loginFailed };
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

  redirect('/lists');
}
