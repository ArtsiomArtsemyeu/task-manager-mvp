'use client';

import Image from 'next/image';
import { clsx } from 'clsx';
import { startTransition, use, useCallback, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/src/i18n/navigation';
import styles from './task-list-details.module.css';
import { AddTask } from '@/src/features/add-task';
import { EditTask } from '@/src/features/edit-task';
import { DeleteTask } from '@/src/features/delete-task';
import { changeTaskStatusAction } from '@/src/features/change-task-status';
import type {
  Task,
  TaskPriority,
  TaskPriorityLevel,
  TaskState,
} from '@/src/entities/task';
import {
  TASK_STATE_MESSAGE_KEYS,
  TASK_STATES,
  calculateTaskListProgress,
  formatTaskDueDate,
  getTaskPriorityLevel,
  isDeadlineWithin48Hours,
  isTaskPriority,
  isTaskState,
  sortTasks,
} from '@/src/entities/task';
import type { TaskListDto } from '@/src/entities/task-list';
import { ProgressBar } from '@/src/shared/ui/components/progress-bar';
import { ErrorHighlight } from '@/src/shared/ui/components/error-highlight';

type StatusFilter = 'all' | TaskState;

type ChangeTaskStatus = (
  id: string,
  taskListId: string,
  state: TaskState,
) => Promise<{ error?: string; success?: boolean }>;

type TaskListDetailsProps = {
  taskListPromise: Promise<TaskListDto>;
  changeTaskStatus?: ChangeTaskStatus;
};

const PRIORITY_CLASS_BY_LEVEL: Record<TaskPriorityLevel, string | undefined> = {
  high: styles.priorityHigh,
  medium: styles.priorityMedium,
  low: styles.priorityLow,
};

export function TaskListDetailsWidget({
  taskListPromise,
  changeTaskStatus = changeTaskStatusAction,
}: TaskListDetailsProps) {
  const t = useTranslations();
  const taskList = use(taskListPromise);
  const [tasks, setTasks] = useState<Task[]>(taskList.tasks);
  const [tasksSource, setTasksSource] = useState<Task[]>(taskList.tasks);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  if (taskList.tasks !== tasksSource) {
    setTasksSource(taskList.tasks);
    setTasks(taskList.tasks);
  }

  const progress = useMemo(() => calculateTaskListProgress(tasks), [tasks]);

  const filteredTasks = useMemo(() => {
    const filtered =
      statusFilter === 'all'
        ? tasks
        : tasks.filter((task: Task) => task.state === statusFilter);

    return sortTasks(filtered);
  }, [statusFilter, tasks]);

  const openAddModal = useCallback(() => setIsAddOpen(true), []);
  const closeAddModal = useCallback(() => setIsAddOpen(false), []);
  const closeEditModal = useCallback(() => setEditingTask(null), []);
  const closeDeleteModal = useCallback(() => setDeletingTask(null), []);

  const onStatusChange = useCallback(
    (taskId: string, nextState: TaskState) => {
      let previousState: TaskState | undefined;

      setStatusError(null);
      setTasks((prev: Task[]) => {
        const current = prev.find((task: Task) => task.id === taskId);
        if (
          !current ||
          !isTaskState(current.state) ||
          current.state === nextState
        ) {
          return prev;
        }

        previousState = current.state;
        return prev.map((task: Task) =>
          task.id === taskId ? { ...task, state: nextState } : task,
        );
      });

      if (!previousState) {
        return;
      }

      const stateToRestore = previousState;

      startTransition(() => {
        void changeTaskStatus(taskId, taskList.id, nextState).then(
          (result: { error?: string; success?: boolean }) => {
            if (!result.error) {
              return;
            }

            setTasks((prev: Task[]) =>
              prev.map((task: Task) =>
                task.id === taskId ? { ...task, state: stateToRestore } : task,
              ),
            );
            setStatusError(result.error);
          },
        );
      });
    },
    [changeTaskStatus, taskList.id],
  );

  return (
    <div className={styles.host}>
      <div className={styles.header}>
        <Link href="/lists" className={styles.backLink}>
          <Image
            className={styles.backIcon}
            src="/images/icons/arrow-left.svg"
            alt={t('common.arrowLeft')}
            width={16}
            height={16}
          />
          {t('taskListDetails.back')}
        </Link>

        <div className={styles.topGrid}>
          <h1 className={styles.title}>{taskList.name}</h1>

          <div className={styles.rightCol}>
            <span className={styles.metaLabel}>
              {t('taskListDetails.taskCount', { count: tasks.length })}
            </span>
            <div className={styles.progressWrap}>
              <span className={styles.metaLabel}>
                {t('taskListDetails.progress', { progress })}
              </span>
              <div className={styles.progressBar}>
                <ProgressBar progress={progress} />
              </div>
            </div>
            <button
              type="button"
              className={styles.addButton}
              onClick={openAddModal}
            >
              {t('taskListDetails.addTask')}
            </button>
          </div>

          <div className={styles.filters}>
            <button
              type="button"
              className={clsx(
                styles.filterBtn,
                statusFilter === 'all' && styles.filterBtnActive,
              )}
              onClick={() => setStatusFilter('all')}
            >
              {t('taskListDetails.filterAll')}
            </button>
            {TASK_STATES.map((state: TaskState) => (
              <button
                key={state}
                type="button"
                className={clsx(
                  styles.filterBtn,
                  statusFilter === state && styles.filterBtnActive,
                )}
                onClick={() => setStatusFilter(state)}
              >
                {t(`taskState.${TASK_STATE_MESSAGE_KEYS[state]}`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {statusError ? <ErrorHighlight message={statusError} /> : null}

      <div className={styles.tableCard}>
        {filteredTasks.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>{t('taskListDetails.emptyTitle')}</p>
            <p className={styles.emptyText}>
              {statusFilter === 'all' ? t('taskListDetails.emptyCreate') : t('taskListDetails.emptyFilter')}
            </p>
          </div>
        ) : (
          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">{t('taskListDetails.colName')}</th>
                  <th scope="col">{t('taskListDetails.colStatus')}</th>
                  <th scope="col">{t('taskListDetails.colPriority')}</th>
                  <th scope="col">{t('taskListDetails.colDueDate')}</th>
                  <th scope="col">{t('taskListDetails.colActions')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task: Task) => {
                  const priority = isTaskPriority(task.priority)
                    ? task.priority
                    : (1 as TaskPriority);
                  const isOverdue = task.state === 'overdue';
                  const isSoon = !isOverdue && isDeadlineWithin48Hours(task);

                  return (
                    <tr key={task.id}>
                      <td>
                        <div className={styles.taskName}>
                          <Link
                            href={`/tasks/${task.id}`}
                            className={styles.taskNameLink}
                          >
                            {task.name}
                          </Link>
                          {task.description ? (
                            <span className={styles.taskDescription}>
                              {task.description}
                            </span>
                          ) : null}
                        </div>
                      </td>
                      <td>
                        <select
                          className={styles.statusSelect}
                          aria-label={t('common.taskStatusAria', {
                            name: task.name,
                          })}
                          value={isTaskState(task.state) ? task.state : 'new'}
                          onChange={(event) => {
                            if (isTaskState(event.target.value)) {
                              onStatusChange(task.id, event.target.value);
                            }
                          }}
                        >
                          {TASK_STATES.map((state: TaskState) => (
                            <option key={state} value={state}>
                              {t(`taskState.${TASK_STATE_MESSAGE_KEYS[state]}`)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <span
                          className={clsx(
                            styles.priority,
                            PRIORITY_CLASS_BY_LEVEL[
                              getTaskPriorityLevel(priority)
                            ],
                          )}
                        >
                          {t(`taskPriority.${String(priority)}`)}
                        </span>
                      </td>
                      <td>
                        <span
                          className={clsx(
                            styles.dueDate,
                            isSoon && styles.dueDateSoon,
                            isOverdue && styles.dueDateOverdue,
                          )}
                        >
                          {formatTaskDueDate(task.dueDate)}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <button
                            type="button"
                            className={styles.iconButton}
                            aria-label={t('common.editTaskAria', {
                              name: task.name,
                            })}
                            onClick={() => setEditingTask(task)}
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
                            className={clsx(
                              styles.iconButton,
                              styles.iconButtonDanger,
                            )}
                            aria-label={t('common.deleteTaskAria', {
                              name: task.name,
                            })}
                            onClick={() => setDeletingTask(task)}
                          >
                            <Image
                              src="/images/icons/trash.svg"
                              alt={t('common.delete')}
                              width={16}
                              height={16}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddTask
        isOpen={isAddOpen}
        taskListId={taskList.id}
        onClose={closeAddModal}
      />
      <EditTask
        isOpen={!!editingTask}
        taskListId={taskList.id}
        task={editingTask}
        onClose={closeEditModal}
      />
      {deletingTask ? (
        <DeleteTask
          isOpen
          taskListId={taskList.id}
          taskId={deletingTask.id}
          taskName={deletingTask.name}
          onClose={closeDeleteModal}
        />
      ) : null}
    </div>
  );
}
