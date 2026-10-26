'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/src/i18n/navigation';
import styles from './error-view.module.css';

type ErrorStatus = 'not-found' | 'server-error';

type ErrorViewProps = {
  status: ErrorStatus;
  onRetry?: () => void;
};

const copyKeys: Record<
  ErrorStatus,
  {
    code: string;
    titleKey: 'notFoundTitle' | 'serverTitle';
    hintKey: 'notFoundHint' | 'serverHint';
    ariaKey: 'notFoundAria' | 'serverAria';
    iconSrc: string;
    iconAltKey: 'notFoundIconAlt' | 'serverIconAlt';
  }
> = {
  'not-found': {
    code: '404',
    titleKey: 'notFoundTitle',
    hintKey: 'notFoundHint',
    ariaKey: 'notFoundAria',
    iconSrc: '/images/icons/not-found.svg',
    iconAltKey: 'notFoundIconAlt',
  },
  'server-error': {
    code: '500',
    titleKey: 'serverTitle',
    hintKey: 'serverHint',
    ariaKey: 'serverAria',
    iconSrc: '/images/icons/server-error.svg',
    iconAltKey: 'serverIconAlt',
  },
};

export function ErrorView({ status, onRetry }: ErrorViewProps) {
  const t = useTranslations();
  const { code, titleKey, hintKey, ariaKey, iconSrc, iconAltKey } =
    copyKeys[status];
  const ariaLabel = t(`errorView.${ariaKey}`);

  return (
    <section className={styles.host} aria-labelledby="error-view-title">
      <div className={styles.visual}>
        <span className={styles.code} aria-hidden="true">
          {code}
        </span>
        <div className={styles.iconWrap}>
          <Image
            className={styles.icon}
            src={iconSrc}
            alt={t(`errorView.${iconAltKey}`)}
            width={44}
            height={44}
          />
        </div>
      </div>

      <div className={styles.content}>
        <h1 id="error-view-title" className={styles.title}>
          {t(`errorView.${titleKey}`)}
        </h1>
        <p className={styles.hint}>{t(`errorView.${hintKey}`)}</p>

        <div className={styles.actions}>
          <Link
            href="/"
            className={styles.homeLink}
            aria-label={t('errorView.goHomeAria', { ariaLabel })}
          >
            {t('errorView.goHome')}
            <Image
              className={styles.arrow}
              src="/images/icons/arrow-right.svg"
              alt={t('common.arrowRight')}
              width={16}
              height={16}
            />
          </Link>

          {onRetry ? (
            <button type="button" className={styles.retryBtn} onClick={onRetry}>
              {t('errorView.retry')}
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
