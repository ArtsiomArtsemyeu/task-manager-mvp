import { hasLocale } from 'next-intl';
import { defineRouting } from 'next-intl/routing';
import { notFound } from 'next/navigation';

export const routing = defineRouting({
  locales: ['ru', 'en'],
  defaultLocale: 'ru',
  localePrefix: 'always',
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];

export function assertLocale(locale: string): Locale {
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return locale;
}

export function readLocale(
  value: FormDataEntryValue | string | null | undefined,
): Locale {
  if (typeof value === 'string' && hasLocale(routing.locales, value)) {
    return value;
  }

  return routing.defaultLocale;
}
