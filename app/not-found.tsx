import { NextIntlClientProvider } from 'next-intl';
import type { Metadata } from 'next';
import ruMessages from '@/messages/ru.json';
import { ErrorView } from '@/src/widgets/error-view';

export const metadata: Metadata = {
  title: ruMessages.metadata.notFoundTitle,
  description: ruMessages.metadata.notFoundDescription,
};

export default function RootNotFound() {
  return (
    <html lang="ru">
      <body>
        <NextIntlClientProvider locale="ru" messages={ruMessages}>
          <ErrorView status="not-found" />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
