'use server';

import { cookies } from 'next/headers';
import { getLocale, getTranslations } from 'next-intl/server';
import { redirect } from '@/src/i18n/navigation';
import { apiUrl } from '@/src/shared/config';
import { createToken } from '@/src/shared/utils/jwt';
import { isRecord, readJson } from '@/src/shared/utils/type-guard';

export type LoginActionState = {
  error?: string;
  success?: boolean;
} | null;

export async function loginAction(
  _prevState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const t = await getTranslations();
  const email = formData.get('email');
  const password = formData.get('password');

  const response = await fetch(apiUrl('/api/auth/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    return { error: t('errors.invalidCredentials') };
  }

  const body = await readJson(response);

  if (!isRecord(body) || !isRecord(body.userSessionPayload)) {
    return { error: t('errors.loginFailed') };
  }

  const jwtToken = createToken(body.userSessionPayload);

  const cookieStore = await cookies();
  cookieStore.set('session_token', jwtToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  const locale = await getLocale();
  redirect({ href: '/lists', locale });
  return null;
}
