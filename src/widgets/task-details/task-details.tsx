'use client';

import Image from 'next/image';
import { clsx } from 'clsx';
import {
  startTransition,
  use,
  useCallback,
  useState,
  type ChangeEvent,
} from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/src/i18n/navigation';
import styles from './task-details.module.css';
import { EditTask } from '@/src/features/edit-task';
import { DeleteTask } from '@/src/features/delete-task';
import { changeTaskStatusAction } from '@/src/features/change-task-status';
import type {
  TaskDto,
  TaskPriority,
  TaskPriorityLevel,
  TaskState,
} from '@/src/entities/task';
import {
  formatTaskDueDate,
  getTaskPriorityLevel,
  isDeadlineWithin48Hours,
  isTaskPriority,
  isTaskState,
  TASK_STATE_MESSAGE_KEYS,
  TASK_STATES,
} from '@/src/entities/task';
import { ErrorHighlight } from '@/src/shared/ui/components/error-highlight';
import { Select } from '@/src/shared/ui/components/select';

type TaskDetailsProps = {
  taskPromise: Promise<TaskDto>;
};

const PRIORITY_CLASS_BY_LEVEL: Record<TaskPriorityLevel, string | undefined> = {
  high: styles.priorityHigh,
  medium: styles.priorityMedium,
  low: styles.priorityLow,
};

function getInitialState(state: string): TaskState {
  return isTaskState(state) ? state : 'new';
}

export function TaskDetailsWidget({ taskPromise }: TaskDetailsProps) {
  const t = useTranslations();
  const task = use(taskPromise);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [status, setStatus] = useState<TaskState>(() =>
    getInitialState(task.state),
  );
  const [statusSource, setStatusSource] = useState<TaskState>(task.state);
  const [statusError, setStatusError] = useState<string | null>(null);

  if (task.state !== statusSource) {
    setStatusSource(task.state);
    setStatus(getInitialState(task.state));
  }

  const priority = isTaskPriority(task.priority)
    ? task.priority
    : (1 as TaskPriority);
  const isOverdue = status === 'overdue';
  const isSoon = !isOverdue && isDeadlineWithin48Hours(task);

  const openEditModal = useCallback(() => setIsEditOpen(true), []);
  const closeEditModal = useCallback(() => setIsEditOpen(false), []);
  const openDeleteModal = useCallback(() => setIsDeleteOpen(true), []);
  const closeDeleteModal = useCallback(() => setIsDeleteOpen(false), []);

  const onStatusChange = useCallback(
    (nextState: TaskState) => {
      let previousState: TaskState | undefined;

      setStatusError(null);
      setStatus((current: TaskState) => {
        if (current === nextState) {
          return current;
        }

        previousState = current;
        return nextState;
      });

      if (!previousState) {
        return;
      }

      const stateToRestore = previousState;

      startTransition(() => {
        void changeTaskStatusAction(task.id, task.taskListId, nextState).then(
          (result: { error?: string; success?: boolean }) => {
            if (!result.error) {
              return;
            }

            setStatus(stateToRestore);
            setStatusError(result.error);
          },
        );
      });
    },
    [task.id, task.taskListId],
  );

  const onStatusSelectChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      if (isTaskState(event.target.value)) {
        onStatusChange(event.target.value);
      }
    },
    [onStatusChange],
  );

  return (
    <div className={styles.host}>
      <div className={styles.header}>
        <Link href={`/lists/${task.taskListId}`} className={styles.backLink}>
          <Image
            className={styles.backIcon}
            src="/images/icons/arrow-left.svg"
            alt={t('common.arrowLeft')}
            width={16}
            height={16}
          />
          {t('taskDetails.back', { name: task.taskListName })}
        </Link>

        <h1 className={styles.title}>{task.name}</h1>
      </div>

      {statusError ? <ErrorHighlight message={statusError} /> : null}

      <section className={styles.card}>
        <div className={styles.metaRow}>
          <div className={styles.metaGroup}>
            <div className={styles.field}>
              <span className={styles.label}>{t('common.priority')}</span>
              <div className={styles.fieldValue}>
                <span
                  className={clsx(
                    styles.priority,
                    PRIORITY_CLASS_BY_LEVEL[getTaskPriorityLevel(priority)],
                  )}
                >
                  {t(`taskPriority.${String(priority)}`)}
                </span>
              </div>
            </div>

            <div className={styles.field}>
              <span className={styles.label}>{t('common.dueDate')}</span>
              <div className={styles.fieldValue}>
                <span
                  className={clsx(
                    styles.dueDate,
                    isSoon && styles.dueDateSoon,
                    isOverdue && styles.dueDateOverdue,
                  )}
                >
                  {formatTaskDueDate(task.dueDate)}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.metaTrailing}>
            <div className={clsx(styles.field, styles.statusField)}>
              <label className={styles.label} htmlFor="task-status">
                {t('common.status')}
              </label>
              <Select
                id="task-status"
                size="sm"
                aria-label={t('common.taskStatusAria', { name: task.name })}
                value={status}
                onChange={onStatusSelectChange}
              >
                {TASK_STATES.map((state: TaskState) => (
                  <option key={state} value={state}>
                    {t(`taskState.${TASK_STATE_MESSAGE_KEYS[state]}`)}
                  </option>
                ))}
              </Select>
            </div>

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.iconButton}
                aria-label={t('common.editTaskAria', { name: task.name })}
                onClick={openEditModal}
              >
                <Image
                  src="/images/icons/edit.svg"
                  alt={t('common.edit')}
                  width={16}
                  height={16}
                />
              </button>
              <button
                type="button"
                className={clsx(styles.iconButton, styles.iconButtonDanger)}
                aria-label={t('common.deleteTaskAria', { name: task.name })}
                onClick={openDeleteModal}
              >
                <Image
                  src="/images/icons/trash.svg"
                  alt={t('common.delete')}
                  width={16}
                  height={16}
                />
              </button>
            </div>
          </div>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>{t('common.description')}</span>
          {task.description ? (
            <p className={styles.description}>{task.description}</p>
          ) : (
            <p className={clsx(styles.description, styles.descriptionEmpty)}>
              {t('taskDetails.noDescription')}
            </p>
          )}
        </div>
      </section>

      <EditTask
        isOpen={isEditOpen}
        taskListId={task.taskListId}
        task={{ ...task, state: status }}
        onClose={closeEditModal}
      />
      <DeleteTask
        isOpen={isDeleteOpen}
        taskListId={task.taskListId}
        taskId={task.id}
        taskName={task.name}
        redirectTo={`/lists/${task.taskListId}`}
        onClose={closeDeleteModal}
      />
    </div>
  );
}
