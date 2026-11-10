'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import styles from './error-view.module.css';
import { Link } from '@/src/shared/i18n';

type ErrorStatus = 'not-found' | 'server-error';

type ErrorViewProps = {
  status: ErrorStatus;
  onRetry?: () => void;
};

export function ErrorView({ status, onRetry }: ErrorViewProps) {
  const t = useTranslations();
  const isNotFound = status === 'not-found';
  const code = isNotFound ? '404' : '500';
  const title = isNotFound ? t('errorView.notFoundTitle') : t('errorView.serverTitle');
  const hint = isNotFound ? t('errorView.notFoundHint') : t('errorView.serverHint');
  const ariaLabel = isNotFound ? t('errorView.notFoundAria') : t('errorView.serverAria');
  const iconSrc = isNotFound
    ? '/images/icons/not-found.svg'
    : '/images/icons/server-error.svg';
  const iconAlt = isNotFound ? t('errorView.notFoundIconAlt') : t('errorView.serverIconAlt');

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
            alt={iconAlt}
            width={44}
            height={44}
          />
        </div>
      </div>

      <div className={styles.content}>
        <h1 id="error-view-title" className={styles.title}>
          {title}
        </h1>
        <p className={styles.hint}>{hint}</p>

        <div className={styles.actions}>
          <Link
            href="/"
            className={styles.homeLink}
            aria-label={t('errorView.homeLinkAria', { label: ariaLabel })}
          >
            {t('errorView.homeLink')}
            <Image
              className={styles.arrow}
              src="/images/icons/arrow-right.svg"
              alt={t('errorView.homeLinkArrowAlt')}
              width={16}
              height={16}
            />
          </Link>

          {onRetry ? (
            <button type="button" className={styles.retryBtn} onClick={onRetry}>
              {t('errorView.tryAgain')}
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
