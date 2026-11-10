'use client';

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

interface TaskListCardProps {
  taskList: TaskListDto;
  onRename: () => void;
  onDelete: () => void;
}

export function TaskListCard({
  taskList,
  onRename,
  onDelete,
}: TaskListCardProps) {
  const t = useTranslations();
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

  return (
    <div className={styles.host}>
      <CardMenu onRenameTasksListName={onRename} onDeleteTasksList={onDelete} />

      <Link href={`/lists/${taskList.id}`} className={styles.link}>
        <div className={styles.title}>{taskList.name}</div>
        <div className={styles.count}>
          {t('taskListCard.taskCountLabel')}
          <span className={styles.countValue}>{taskList.tasks.length}</span>
        </div>
        <TaskMetrics tasks={taskList.tasks} />
        <ProgressBar progress={taskListProgress} />
        <div className={styles.indicators}>
          {hasOverdueTasks && <Chip label={t('taskListCard.hasOverdueTasks')} color="red" />}
          {hasDeadlineTasks && (
            <Chip label={t('taskListCard.dueWithin48Hours')} color="yellow" />
          )}
        </div>
      </Link>
    </div>
  );
}
