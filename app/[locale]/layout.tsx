import '@/app/reset.css';
import '@/app/global.css';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { supportedThemes } from '@/src/app/configs';
import { ColorThemeProvider } from '@/src/app/providers';
import { assertLocale, routing } from '@/src/shared/i18n';
import { Footer } from '@/src/widgets/footer';
import { Header } from '@/src/widgets/header';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LocaleLayoutProps): Promise<Metadata> {
  const locale = assertLocale((await params).locale);
  const t = await getTranslations({ locale });

  return {
    title: t('metadata.appTitle'),
    description: t('metadata.appDescription'),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const locale = assertLocale((await params).locale);

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body>
        <ColorThemeProvider>
          <NextIntlClientProvider>
            <Header themes={supportedThemes} />
            <main className="rootHost">{children}</main>
            <Footer />
          </NextIntlClientProvider>
        </ColorThemeProvider>
      </body>
    </html>
  );
}
