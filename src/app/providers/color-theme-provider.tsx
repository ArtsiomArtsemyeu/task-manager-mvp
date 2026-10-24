'use client';

import { ThemeProvider } from 'next-themes';

export function ColorThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="default"
      themes={['default', 'dark', 'light']}
    >
      {children}
    </ThemeProvider>
  );
}
