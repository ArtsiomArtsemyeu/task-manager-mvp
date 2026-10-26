import type { AppLocale } from '@/src/i18n/routing';

export type LocaleConfig = {
  value: AppLocale;
  labelKey: AppLocale;
};

export const supportedLocales: LocaleConfig[] = [
  { value: 'ru', labelKey: 'ru' },
  { value: 'en', labelKey: 'en' },
];
