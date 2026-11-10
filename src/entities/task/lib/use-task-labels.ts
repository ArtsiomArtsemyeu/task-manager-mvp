'use client';

import { useTranslations } from 'next-intl';
import type { TaskPriority, TaskState } from '../config/task.config';

export function useTaskLabels() {
  const t = useTranslations();

  const stateLabel = (state: TaskState): string => {
    switch (state) {
      case 'in progress':
        return t('task.state.inProgress');
      case 'done':
        return t('task.state.done');
      case 'overdue':
        return t('task.state.overdue');
      case 'new':
      default:
        return t('task.state.new');
    }
  };

  const priorityLabel = (priority: TaskPriority): string => {
    switch (priority) {
      case 2:
        return t('task.priority.medium');
      case 3:
        return t('task.priority.high');
      case 1:
      default:
        return t('task.priority.low');
    }
  };

  return { stateLabel, priorityLabel };
}
