import { hasLocale } from 'next-intl';
import { cookies, headers } from 'next/headers';
import { routing, type AppLocale } from '@/src/i18n/routing';

export async function resolveRequestLocale(): Promise<AppLocale> {
  const cookieLocale = (await cookies()).get('NEXT_LOCALE')?.value;
  if (hasLocale(routing.locales, cookieLocale)) {
    return cookieLocale;
  }

  const acceptLanguage = (await headers()).get('accept-language');
  if (acceptLanguage) {
    const candidates = acceptLanguage
      .split(',')
      .map((part) => part.split(';')[0]?.trim().toLowerCase())
      .filter((value): value is string => Boolean(value));

    for (const candidate of candidates) {
      if (hasLocale(routing.locales, candidate)) {
        return candidate;
      }

      const base = candidate.split('-')[0];
      if (base && hasLocale(routing.locales, base)) {
        return base;
      }
    }
  }

  return routing.defaultLocale;
}
