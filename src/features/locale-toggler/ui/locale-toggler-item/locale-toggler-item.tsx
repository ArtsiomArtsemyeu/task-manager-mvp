'use client';

import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';
import { useCallback } from 'react';
import styles from './locale-toggler-item.module.css';
import type { Locale } from '@/src/shared/i18n';
import { Link } from '@/src/shared/i18n';

const localeLabel = {
  ru: 'localeToggler.ru',
  en: 'localeToggler.en',
} as const;

type LocaleTogglerItemProps = {
  locale: Locale;
  pathname: string;
  selected: boolean;
  onSelect: () => void;
};

export function LocaleTogglerItem({
  locale,
  pathname,
  selected,
  onSelect,
}: LocaleTogglerItemProps) {
  const t = useTranslations();
  const onClick = useCallback(() => {
    onSelect();
  }, [onSelect]);

  return (
    <li>
      <Link
        href={pathname}
        locale={locale}
        hrefLang={locale}
        lang={locale}
        className={clsx(styles.localeItem, selected && styles.localeItemSelected)}
        aria-current={selected ? 'true' : undefined}
        onClick={onClick}
      >
        {t(localeLabel[locale])}
      </Link>
    </li>
  );
}
