'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import styles from './task-metrics.module.css';
import type { Task } from '@/src/entities/task';
import { calculateTaskCountByState } from '@/src/entities/task';

type TaskMetricsProps = {
  tasks: Task[];
};

export function TaskMetrics({ tasks }: TaskMetricsProps) {
  const t = useTranslations();
  const newTaskCount = useMemo(
    () => calculateTaskCountByState(tasks, 'new'),
    [tasks],
  );
  const inProgressTaskCount = useMemo(
    () => calculateTaskCountByState(tasks, 'in progress'),
    [tasks],
  );
  const doneTaskCount = useMemo(
    () => calculateTaskCountByState(tasks, 'done'),
    [tasks],
  );
  const overdueTaskCount = useMemo(
    () => calculateTaskCountByState(tasks, 'overdue'),
    [tasks],
  );

  return (
    <div className={styles.host}>
      <div className={styles.item}>
        <span className={styles.label}>{t('taskListCard.new')}</span>
        <span className={`${styles.value} ${styles.new}`}>{newTaskCount}</span>
      </div>
      <div className={styles.item}>
        <span className={styles.label}>{t('taskListCard.inProgress')}</span>
        <span className={`${styles.value} ${styles.progress}`}>
          {inProgressTaskCount}
        </span>
      </div>
      <div className={styles.item}>
        <span className={styles.label}>{t('taskListCard.done')}</span>
        <span className={`${styles.value} ${styles.done}`}>
          {doneTaskCount}
        </span>
      </div>
      <div className={styles.item}>
        <span className={styles.label}>{t('taskListCard.overdue')}</span>
        <span className={`${styles.value} ${styles.overdue}`}>
          {overdueTaskCount}
        </span>
      </div>
    </div>
  );
}
