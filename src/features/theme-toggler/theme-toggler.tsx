'use client';

import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ThemeConfig } from './config/theme.config';
import styles from './theme-toggler.module.css';
import { ThemeTogglerItem } from './ui/theme-toggler-item/theme-toggler-item';

type ThemeTogglerProps = {
  themes: ThemeConfig[];
};

export function ThemeToggler({ themes }: ThemeTogglerProps) {
  const t = useTranslations();
  const { theme, setTheme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpenDropdown, setIsOpenDropdown] = useState<boolean>(false);

  const changeTheme = useCallback(
    (newTheme: string) => {
      setTheme(newTheme);
      setIsOpenDropdown(false);
    },
    [setTheme],
  );

  const onToggleDropdown = useCallback(
    (): void => setIsOpenDropdown((prevState: boolean) => !prevState),
    [],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpenDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.dropdownContainer} ref={dropdownRef}>
      <button
        type="button"
        className={clsx(styles.dropdownButton, isOpenDropdown && styles.active)}
        onClick={onToggleDropdown}
        aria-label={t('theme.chooseTheme')}
        aria-haspopup
        aria-expanded={isOpenDropdown}
      >
        <span className={styles.icon} aria-hidden />
      </button>

      {isOpenDropdown && (
        <ul className={styles.dropdownMenu}>
          {themes.map((themeItem: ThemeConfig) => (
            <ThemeTogglerItem
              key={`themeOption-${themeItem.value}`}
              theme={themeItem}
              selected={theme === themeItem.value}
              onChange={changeTheme}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
