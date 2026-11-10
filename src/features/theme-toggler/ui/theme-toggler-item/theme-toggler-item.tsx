'use client';

import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';
import { useCallback } from 'react';
import type { ThemeConfig } from '../../config/theme.config';
import styles from './theme-toggler-item.module.css';

const themeLabel = {
  default: 'theme.systemTheme',
  light: 'theme.lightTheme',
  dark: 'theme.darkTheme',
} as const;

type ThemeTogglerItemProps = {
  theme: ThemeConfig;
  selected: boolean;
  onChange: (themeValue: string) => void;
};

export function ThemeTogglerItem({
  theme,
  selected,
  onChange,
}: ThemeTogglerItemProps) {
  const t = useTranslations();
  const onClickThemeItem = useCallback(
    () => onChange(theme.value),
    [onChange, theme.value],
  );

  return (
    <li
      key={`themeItem-${theme.value}`}
      className={clsx(styles.themeItem, selected && styles.themeItemSelected)}
      onClick={onClickThemeItem}
    >
      {t(themeLabel[theme.value])}
    </li>
  );
}
