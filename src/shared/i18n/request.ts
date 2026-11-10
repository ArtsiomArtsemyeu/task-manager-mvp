import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { locale as rootLocale } from 'next/root-params';
import { routing, type Locale } from './routing';

async function loadMessages(locale: Locale) {
  switch (locale) {
    case 'ru':
      return (await import('@/messages/ru.json')).default;
    case 'en':
      return (await import('@/messages/en.json')).default;
  }
}

async function requestConfig(locale: Locale) {
  return {
    locale,
    messages: await loadMessages(locale),
  };
}

export default getRequestConfig(async ({ locale, requestLocale }) => {
  if (hasLocale(routing.locales, locale)) {
    return requestConfig(locale);
  }

  try {
    const requested = await rootLocale();

    if (hasLocale(routing.locales, requested)) {
      return requestConfig(requested);
    }
  } catch {
    // The root not-found route has no locale segment.
  }

  const fromRequest = await requestLocale;

  if (hasLocale(routing.locales, fromRequest)) {
    return requestConfig(fromRequest);
  }

  return requestConfig(routing.defaultLocale);
});
