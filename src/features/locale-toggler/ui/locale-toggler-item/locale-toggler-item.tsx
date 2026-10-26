'use client';

import { clsx } from 'clsx';
import { useCallback } from 'react';
import type { LocaleConfig } from '../../config/locale.config';
import styles from './locale-toggler-item.module.css';

type LocaleTogglerItemProps = {
  localeItem: LocaleConfig;
  label: string;
  selected: boolean;
  onChange: (locale: LocaleConfig['value']) => void;
};

export function LocaleTogglerItem({
  localeItem,
  label,
  selected,
  onChange,
}: LocaleTogglerItemProps) {
  const onClickLocaleItem = useCallback(
    () => onChange(localeItem.value),
    [onChange, localeItem.value],
  );

  return (
    <li
      className={clsx(styles.localeItem, selected && styles.localeItemSelected)}
      onClick={onClickLocaleItem}
    >
      {label}
    </li>
  );
}
