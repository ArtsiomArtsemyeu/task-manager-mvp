'use client';

import { clsx } from 'clsx';
import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import styles from './task-list-card.module.css';
import { CardMenu } from './ui/card-menu/card-menu';
import { TaskMetrics } from './ui/task-metrics/task-metrics';
import {
  calculateTaskCountByState,
  calculateTaskListProgress,
  isDeadlineWithin48Hours,
} from '@/src/entities/task';
import type { TaskListDto } from '@/src/entities/task-list';
import { Link } from '@/src/shared/i18n';
import { ProgressBar } from '@/src/shared/ui/components/progress-bar';
import { Chip } from '@/src/shared/ui/components/chip';

type TaskListCardProps = {
  taskList: TaskListDto;
  elevateOnHover?: boolean;
  contentSize?: 'default' | 'large';
  interactive?: boolean;
  onRename?: () => void;
  onDelete?: () => void;
};

export function TaskListCard({
  taskList,
  elevateOnHover = true,
  contentSize = 'default',
  interactive = true,
  onRename,
  onDelete,
}: TaskListCardProps) {
  const t = useTranslations();
  const isInteractive = interactive && onRename != null && onDelete != null;
  const taskListProgress = useMemo(
    () => calculateTaskListProgress(taskList.tasks),
    [taskList],
  );

  const hasOverdueTasks = useMemo(
    () => calculateTaskCountByState(taskList.tasks, 'overdue') > 0,
    [taskList],
  );

  const hasDeadlineTasks = useMemo(
    () => taskList.tasks.filter(isDeadlineWithin48Hours).length > 0,
    [taskList],
  );

  const content = (
    <>
      <div className={styles.title}>{taskList.name}</div>
      <div className={styles.count}>
        {t('taskListCard.taskCountLabel')}
        <span className={styles.countValue}>{taskList.tasks.length}</span>
      </div>
      <TaskMetrics tasks={taskList.tasks} />
      <ProgressBar progress={taskListProgress} />
      <div className={styles.indicators}>
        {hasOverdueTasks ? (
          <Chip label={t('taskListCard.hasOverdueTasks')} color="red" />
        ) : null}
        {hasDeadlineTasks ? (
          <Chip label={t('taskListCard.dueWithin48Hours')} color="yellow" />
        ) : null}
      </div>
    </>
  );

  return (
    <div
      className={clsx(
        styles.host,
        !elevateOnHover && styles.staticHost,
        contentSize === 'large' && styles.largeContent,
      )}
    >
      {isInteractive ? (
        <>
          <CardMenu
            onRenameTasksListName={onRename}
            onDeleteTasksList={onDelete}
          />
          <Link href={`/lists/${taskList.id}`} className={styles.link}>
            {content}
          </Link>
        </>
      ) : (
        <div className={styles.link}>{content}</div>
      )}
    </div>
  );
}
