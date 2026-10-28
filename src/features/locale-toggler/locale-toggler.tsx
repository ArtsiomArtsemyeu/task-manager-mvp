'use client';

import { clsx } from 'clsx';
import { useLocale, useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getPathname, usePathname } from '@/src/i18n/navigation';
import type { AppLocale } from '@/src/i18n/routing';
import {
  supportedLocales,
  type LocaleConfig,
} from './config/locale.config';
import styles from './locale-toggler.module.css';
import { LocaleTogglerItem } from './ui/locale-toggler-item/locale-toggler-item';

export function LocaleToggler() {
  const t = useTranslations();
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);

  const changeLocale = useCallback(
    (nextLocale: AppLocale) => {
      setIsOpenDropdown(false);
      if (nextLocale === locale) {
        return;
      }

      const nextPath = getPathname({ href: pathname, locale: nextLocale });
      window.location.assign(
        `${nextPath}${window.location.search}${window.location.hash}`,
      );
    },
    [locale, pathname],
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
        aria-label={t('locale.ariaLabel')}
        aria-haspopup
        aria-expanded={isOpenDropdown}
      >
        <span className={styles.icon} aria-hidden />
      </button>

      {isOpenDropdown && (
        <ul className={styles.dropdownMenu}>
          {supportedLocales.map((localeItem: LocaleConfig) => (
            <LocaleTogglerItem
              key={`localeOption-${localeItem.value}`}
              localeItem={localeItem}
              label={t(`locale.${localeItem.labelKey}`)}
              selected={locale === localeItem.value}
              onChange={changeLocale}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
