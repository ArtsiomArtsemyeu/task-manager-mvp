'use client';

import { clsx } from 'clsx';
import { useLocale, useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { usePathname, useRouter } from '@/src/i18n/navigation';
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
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);

  const changeLocale = useCallback(
    (nextLocale: AppLocale) => {
      startTransition(() => {
        router.replace(pathname, { locale: nextLocale });
      });
      setIsOpenDropdown(false);
    },
    [pathname, router],
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
        {locale}
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
