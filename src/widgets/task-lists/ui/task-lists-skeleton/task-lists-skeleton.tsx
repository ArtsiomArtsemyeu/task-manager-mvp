'use client';

import { useTranslations } from 'next-intl';
import styles from './task-lists-skeleton.module.css';
import { TaskListCardSkeleton } from '@/src/features/task-list-card';
import { Skeleton } from '@/src/shared/ui/components/skeleton';

const CARD_PLACEHOLDERS = 6;

export function TaskListsSkeleton() {
  const t = useTranslations();

  return (
    <div
      className={styles.host}
      role="status"
      aria-busy="true"
      aria-label={t('taskLists.loadingAria')}
    >
      <div className={styles.toolbar}>
        <Skeleton className={styles.search} height="2.75rem" />
        <Skeleton className={styles.addButton} height="2.75rem" />
      </div>

      <div className={styles.list}>
        {Array.from({ length: CARD_PLACEHOLDERS }).map((_: unknown, index: number) => (
          <TaskListCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
