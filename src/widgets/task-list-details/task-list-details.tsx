'use client';

import Image from 'next/image';
import { clsx } from 'clsx';
import { useLocale, useTranslations } from 'next-intl';
import { startTransition, use, useCallback, useMemo, useState } from 'react';
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
  TASK_STATES,
  calculateTaskListProgress,
  formatTaskDueDate,
  getTaskPriorityLevel,
  isDeadlineWithin48Hours,
  isTaskPriority,
  isTaskState,
  sortTasks,
  useTaskLabels,
} from '@/src/entities/task';
import type { TaskListDto } from '@/src/entities/task-list';
import type { ActionErrorCode, ActionResult } from '@/src/shared/config';
import { Link } from '@/src/shared/i18n';
import { ProgressBar } from '@/src/shared/ui/components/progress-bar';
import { ErrorHighlight } from '@/src/shared/ui/components/error-highlight';
import { Select } from '@/src/shared/ui/components/select';

type StatusFilter = 'all' | TaskState;

type ChangeTaskStatus = (
  id: string,
  taskListId: string,
  state: TaskState,
  locale: string,
) => Promise<NonNullable<ActionResult>>;

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
  const taskList = use(taskListPromise);
  const locale = useLocale();
  const t = useTranslations();
  const { stateLabel, priorityLabel } = useTaskLabels();
  const [tasks, setTasks] = useState<Task[]>(taskList.tasks);
  const [tasksSource, setTasksSource] = useState<Task[]>(taskList.tasks);
  const [statusError, setStatusError] = useState<ActionErrorCode | null>(null);
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
        void changeTaskStatus(taskId, taskList.id, nextState, locale).then(
          (result) => {
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
    [changeTaskStatus, locale, taskList.id],
  );

  return (
    <div className={styles.host}>
      <div className={styles.header}>
        <Link href="/lists" className={styles.backLink}>
          <Image
            className={styles.backIcon}
            src="/images/icons/arrow-left.svg"
            alt={t('taskListDetails.backToTaskListsArrowAlt')}
            width={16}
            height={16}
          />
          {t('taskListDetails.backToTaskLists')}
        </Link>

        <div className={styles.topGrid}>
          <h1 className={styles.title}>{taskList.name}</h1>

          <div className={styles.rightCol}>
            <span className={styles.metaLabel}>
              {t('taskListDetails.taskCount', { count: tasks.length })}
            </span>
            <div className={styles.progressWrap}>
              <span className={styles.metaLabel}>
                {t('taskListDetails.taskListProgress', { progress })}
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
              {t('taskListDetails.showAllTasks')}
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
                {stateLabel(state)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {statusError ? <ErrorHighlight message={t(statusError)} /> : null}

      <div className={styles.tableCard}>
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <colgroup>
              <col className={styles.colName} />
              <col className={styles.colStatus} />
              <col className={styles.colPriority} />
              <col className={styles.colDue} />
              <col className={styles.colActions} />
            </colgroup>
            <thead>
              <tr>
                <th scope="col">{t('taskListDetails.taskName')}</th>
                <th scope="col">{t('taskListDetails.taskStatus')}</th>
                <th scope="col">{t('taskListDetails.taskPriority')}</th>
                <th scope="col">{t('taskListDetails.taskDueDate')}</th>
                <th scope="col">{t('taskListDetails.taskActions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className={styles.empty}>
                      <p className={styles.emptyTitle}>{t('taskListDetails.noTasksFound')}</p>
                      <p className={styles.emptyText}>
                        {statusFilter === 'all'
                          ? t('taskListDetails.createFirstTask')
                          : t('taskListDetails.noTasksForStatus')}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task: Task) => {
                  const priority = isTaskPriority(task.priority)
                    ? task.priority
                    : (1 as TaskPriority);
                  const isOverdue = task.state === 'overdue';
                  const isSoon = !isOverdue && isDeadlineWithin48Hours(task);

                  return (
                    <tr key={task.id} className={styles.taskRow}>
                      <td data-label={t('taskListDetails.taskName')}>
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
                      <td data-label={t('taskListDetails.taskStatus')}>
                        <Select
                          className={styles.statusSelect}
                          size="sm"
                          aria-label={t('taskListDetails.statusOfTask', { name: task.name })}
                          value={isTaskState(task.state) ? task.state : 'new'}
                          onChange={(event) => {
                            if (isTaskState(event.target.value)) {
                              onStatusChange(task.id, event.target.value);
                            }
                          }}
                        >
                          {TASK_STATES.map((state: TaskState) => (
                            <option key={state} value={state}>
                              {stateLabel(state)}
                            </option>
                          ))}
                        </Select>
                      </td>
                      <td data-label={t('taskListDetails.taskPriority')}>
                        <span
                          className={clsx(
                            styles.priority,
                            PRIORITY_CLASS_BY_LEVEL[
                              getTaskPriorityLevel(priority)
                            ],
                          )}
                        >
                          {priorityLabel(priority)}
                        </span>
                      </td>
                      <td data-label={t('taskListDetails.taskDueDate')}>
                        <span
                          className={clsx(
                            styles.dueDate,
                            isSoon && styles.dueDateSoon,
                            isOverdue && styles.dueDateOverdue,
                          )}
                        >
                          {formatTaskDueDate(task.dueDate, locale)}
                        </span>
                      </td>
                      <td data-label={t('taskListDetails.taskActions')}>
                        <div className={styles.actions}>
                          <button
                            type="button"
                            className={styles.iconButton}
                            aria-label={t('taskListDetails.editTask', { name: task.name })}
                            onClick={() => setEditingTask(task)}
                          >
                            <Image
                              src="/images/icons/edit.svg"
                              alt={t('taskListDetails.editTaskIconAlt')}
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
                            aria-label={t('taskListDetails.deleteTask', { name: task.name })}
                            onClick={() => setDeletingTask(task)}
                          >
                            <Image
                              src="/images/icons/trash.svg"
                              alt={t('taskListDetails.deleteTaskIconAlt')}
                              width={16}
                              height={16}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
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
