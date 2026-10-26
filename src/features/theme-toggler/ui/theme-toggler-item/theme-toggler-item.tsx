'use client';

import { clsx } from 'clsx';
import { useCallback } from 'react';
import type { ThemeConfig } from '../../config/theme.config';
import styles from './theme-toggler-item.module.css';

type ThemeTogglerItemProps = {
  theme: ThemeConfig;
  label: string;
  selected: boolean;
  onChange: (themeValue: string) => void;
};

export function ThemeTogglerItem({
  theme,
  label,
  selected,
  onChange,
}: ThemeTogglerItemProps) {
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
      {label}
    </li>
  );
}
