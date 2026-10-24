import Image from 'next/image';
import Link from 'next/link';
import styles from './error-page.module.css';

type ErrorStatus = 'not-found' | 'server-error';

type ErrorPageProps = {
  status: ErrorStatus;
  onRetry?: () => void;
};

const copy: Record<
  ErrorStatus,
  {
    code: string;
    title: string;
    hint: string;
    ariaLabel: string;
    iconSrc: string;
    iconAlt: string;
  }
> = {
  'not-found': {
    code: '404',
    title: 'Страница не найдена.',
    hint: 'Такой страницы нет или она была перемещена. Вернитесь на главную и продолжите работу с задачами.',
    ariaLabel: 'Страница не найдена',
    iconSrc: '/images/icons/not-found.svg',
    iconAlt: 'Иконка: страница не найдена',
  },
  'server-error': {
    code: '500',
    title: 'Что-то пошло не так.',
    hint: 'Произошла внутренняя ошибка. Попробуйте ещё раз или вернитесь на главную страницу.',
    ariaLabel: 'Ошибка сервера',
    iconSrc: '/images/icons/server-error.svg',
    iconAlt: 'Иконка: ошибка сервера',
  },
};

export function ErrorPage({ status, onRetry }: ErrorPageProps) {
  const { code, title, hint, ariaLabel, iconSrc, iconAlt } = copy[status];

  return (
    <section className={styles.host} aria-labelledby="error-page-title">
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
        <h1 id="error-page-title" className={styles.title}>
          {title}
        </h1>
        <p className={styles.hint}>{hint}</p>

        <div className={styles.actions}>
          <Link
            href="/"
            className={styles.homeLink}
            aria-label={`${ariaLabel}. Перейти на главную страницу`}
          >
            Перейти на главную страницу
            <Image
              className={styles.arrow}
              src="/images/icons/arrow-right.svg"
              alt="Стрелка вправо"
              width={16}
              height={16}
            />
          </Link>

          {onRetry ? (
            <button type="button" className={styles.retryBtn} onClick={onRetry}>
              Попробовать снова
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
