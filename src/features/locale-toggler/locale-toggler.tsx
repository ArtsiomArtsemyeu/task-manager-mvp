'use client';

import { clsx } from 'clsx';
import { useLocale, useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './locale-toggler.module.css';
import { LocaleTogglerItem } from './ui/locale-toggler-item/locale-toggler-item';
import { routing, usePathname } from '@/src/shared/i18n';

export function LocaleToggler() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpenDropdown, setIsOpenDropdown] = useState<boolean>(false);

  const closeDropdown = useCallback(() => {
    setIsOpenDropdown(false);
  }, []);

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
        aria-label={t('localeToggler.chooseLanguage')}
        aria-haspopup
        aria-expanded={isOpenDropdown}
      >
        <span className={styles.icon} aria-hidden />
      </button>

      {isOpenDropdown && (
        <ul className={styles.dropdownMenu}>
          {routing.locales.map((item) => (
            <LocaleTogglerItem
              key={item}
              locale={item}
              pathname={pathname}
              selected={locale === item}
              onSelect={closeDropdown}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
