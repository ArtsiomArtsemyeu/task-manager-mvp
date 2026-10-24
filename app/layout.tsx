import '@/app/reset.css';
import '@/app/global.css';
import type { Metadata } from 'next';
import { Footer } from '@/src/widgets/footer';
import { Header } from '@/src/widgets/header';
import { Geist, Geist_Mono } from 'next/font/google';
import { supportedThemes } from '@/src/app/configs';
import { ColorThemeProvider } from '@/src/app/providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Менеджер задач',
  description: 'Приложение для управления задачами',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body>
        <ColorThemeProvider>
          <Header themes={supportedThemes} />
          <main className="rootHost">{children}</main>
          <Footer />
        </ColorThemeProvider>
      </body>
    </html>
  );
}
