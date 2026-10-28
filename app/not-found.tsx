import { NextIntlClientProvider } from 'next-intl';
import type { Metadata } from 'next';
import enMessages from '@/messages/en.json';
import ruMessages from '@/messages/ru.json';
import { resolveRequestLocale } from '@/src/i18n/resolve-request-locale';
import { ErrorView } from '@/src/widgets/error-view';

const messagesByLocale = {
  ru: ruMessages,
  en: enMessages,
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await resolveRequestLocale();
  const messages = messagesByLocale[locale];

  return {
    title: messages.metadata.notFoundTitle,
    description: messages.metadata.notFoundDescription,
  };
}

export default async function RootNotFound() {
  const locale = await resolveRequestLocale();
  const messages = messagesByLocale[locale];

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ErrorView status="not-found" />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
