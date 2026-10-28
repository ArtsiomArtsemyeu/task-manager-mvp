'use client';

import { useTranslations } from 'next-intl';
import styles from './task-list-details-skeleton.module.css';
import { Skeleton } from '@/src/shared/ui/components/skeleton';

const ROW_PLACEHOLDERS = 5;

export function TaskListDetailsSkeleton() {
  const t = useTranslations();

  return (
    <div
      className={styles.host}
      role="status"
      aria-busy="true"
      aria-label={t('taskListDetails.loadingAria')}
    >
      <div className={styles.header}>
        <Skeleton width="8.5rem" height="2.65rem" />

        <div className={styles.topGrid}>
          <div className={styles.title}>
            <Skeleton width="min(100%, 18rem)" height="2rem" />
          </div>

          <div className={styles.rightCol}>
            <Skeleton width="11rem" height="0.9rem" />
            <div className={styles.progressRow}>
              <Skeleton width="6.5rem" height="0.9rem" />
              <Skeleton className={styles.progressBar} height="0.55rem" />
            </div>
            <Skeleton className={styles.addButton} />
          </div>

          <div className={styles.filters}>
            {Array.from({ length: 5 }).map((_: unknown, index: number) => (
              <Skeleton key={index} width="5.5rem" height="2rem" />
            ))}
          </div>
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableScroll}>
          <div className={styles.tableHead}>
            <Skeleton width="5rem" height="0.7rem" />
            <Skeleton width="4rem" height="0.7rem" />
            <Skeleton width="5rem" height="0.7rem" />
            <Skeleton width="4.5rem" height="0.7rem" />
            <Skeleton width="4rem" height="0.7rem" />
          </div>

          {Array.from({ length: ROW_PLACEHOLDERS }).map(
            (_: unknown, index: number) => (
              <div key={index} className={styles.row}>
                <div className={styles.nameBlock}>
                  <Skeleton width="70%" height="1rem" />
                  <Skeleton width="90%" height="0.8rem" />
                </div>
                <Skeleton width="7rem" height="2rem" />
                <Skeleton width="4.5rem" height="1.5rem" />
                <Skeleton width="7rem" height="0.95rem" />
                <div className={styles.actions}>
                  <Skeleton width="2rem" height="2rem" circle />
                  <Skeleton width="2rem" height="2rem" circle />
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
