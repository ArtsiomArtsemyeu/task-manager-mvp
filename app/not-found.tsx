import '@/app/reset.css';
import '@/app/global.css';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import {
  getLocale,
  getMessages,
  getTranslations,
} from 'next-intl/server';
import { ColorThemeProvider } from '@/src/app/providers';
import { ErrorView } from '@/src/widgets/error-view';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: t('metadata.notFoundTitle'),
    description: t('metadata.notFoundDescription'),
  };
}

export default async function NotFound() {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body>
        <ColorThemeProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <ErrorView status="not-found" />
          </NextIntlClientProvider>
        </ColorThemeProvider>
      </body>
    </html>
  );
}
