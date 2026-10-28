import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locale as getLocaleParam } from 'next/root-params';
import en from '@/messages/en.json';
import ru from '@/messages/ru.json';
import { routing, type AppLocale } from '@/src/i18n/routing';
import { resolveRequestLocale } from '@/src/i18n/resolve-request-locale';

const messagesByLocale = {
  ru,
  en,
} as const satisfies Record<AppLocale, typeof ru>;

export default getRequestConfig(async ({ locale: overrideLocale }) => {
  let locale = overrideLocale;

  if (!locale) {
    try {
      const paramValue = await getLocaleParam();
      if (hasLocale(routing.locales, paramValue)) {
        locale = paramValue;
      } else {
        notFound();
      }
    } catch {
      locale = await resolveRequestLocale();
    }
  }

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return {
    locale,
    messages: messagesByLocale[locale],
  };
});
