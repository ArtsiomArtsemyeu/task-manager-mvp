"use client";

import Image from "next/image";
import Link from "next/link";
import { clsx } from "clsx";
import { startTransition, useCallback, useEffect, useState } from "react";
import styles from "./task-details.module.css";
import { EditTaskModal } from "@/src/features/edit-task-modal";
import { DeleteTaskModal } from "@/src/features/delete-task-modal";
import { changeTaskStatusAction } from "@/src/features/change-task-status";
import type {
  TaskDto,
  TaskPriority,
  TaskState} from "@/src/entities/task";
import {
  formatTaskDueDate,
  isDeadlineWithin48Hours,
  isTaskPriority,
  isTaskState,
  TASK_PRIORITY_LABELS,
  TASK_STATE_LABELS,
  TASK_STATES
} from "@/src/entities/task";
import { ErrorHighlight } from "@/src/shared/ui/components/error-highlight";

type TaskDetailsProps = {
  task: TaskDto;
};

function getPriorityClass(priority: number): string | undefined {
  if (priority >= 3) {
    return styles.priorityHigh;
  }
  if (priority === 2) {
    return styles.priorityMedium;
  }
  return styles.priorityLow;
}

function getInitialState(state: string): TaskState {
  return isTaskState(state) ? state : "new";
}

export function TaskDetailsWidget({ task }: TaskDetailsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [status, setStatus] = useState<TaskState>(() =>
    getInitialState(task.state),
  );
  const [statusError, setStatusError] = useState<string | null>(null);

  useEffect(() => {
    setStatus(getInitialState(task.state));
  }, [task.state]);

  const priority = isTaskPriority(task.priority)
    ? task.priority
    : (2 as TaskPriority);
  const isOverdue = status === "overdue";
  const isSoon = !isOverdue && isDeadlineWithin48Hours(task);

  const openEditModal = useCallback(() => setIsEditOpen(true), []);
  const closeEditModal = useCallback(() => setIsEditOpen(false), []);
  const openDeleteModal = useCallback(() => setIsDeleteOpen(true), []);
  const closeDeleteModal = useCallback(() => setIsDeleteOpen(false), []);

  const onStatusChange = useCallback(
    (nextState: TaskState) => {
      let previousState: TaskState | undefined;

      setStatusError(null);
      setStatus((current) => {
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
          (result) => {
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

  return (
    <div className={styles.host}>
      <header className={styles.header}>
        <Link href={`/lists/${task.taskListId}`} className={styles.backLink}>
          ← К списку «{task.taskListName}»
        </Link>

        <div className={styles.topRow}>
          <h1 className={styles.title}>{task.name}</h1>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.iconButton}
              aria-label={`Редактировать задачу ${task.name}`}
              onClick={openEditModal}
            >
              <Image
                src="/images/icons/edit.svg"
                alt="Редактировать"
                width={16}
                height={16}
              />
            </button>
            <button
              type="button"
              className={clsx(styles.iconButton, styles.iconButtonDanger)}
              aria-label={`Удалить задачу ${task.name}`}
              onClick={openDeleteModal}
            >
              <Image
                src="/images/icons/trash.svg"
                alt="Удалить"
                width={16}
                height={16}
              />
            </button>
          </div>
        </div>
      </header>

      {statusError ? <ErrorHighlight message={statusError} /> : null}

      <section className={styles.card}>
        <div className={styles.field}>
          <span className={styles.label}>Описание</span>
          {task.description ? (
            <p className={styles.description}>{task.description}</p>
          ) : (
            <p className={clsx(styles.description, styles.descriptionEmpty)}>
              Описание не указано
            </p>
          )}
        </div>

        <div className={styles.metaRow}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="task-status">
              Статус
            </label>
            <select
              id="task-status"
              className={styles.statusSelect}
              aria-label={`Статус задачи ${task.name}`}
              value={status}
              onChange={(event) => {
                if (isTaskState(event.target.value)) {
                  onStatusChange(event.target.value);
                }
              }}
            >
              {TASK_STATES.map((state) => (
                <option key={state} value={state}>
                  {TASK_STATE_LABELS[state]}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <span className={styles.label}>Приоритет</span>
            <span
              className={clsx(styles.priority, getPriorityClass(priority))}
            >
              {TASK_PRIORITY_LABELS[priority]}
            </span>
          </div>

          <div className={styles.field}>
            <span className={styles.label}>Дедлайн</span>
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
      </section>

      <EditTaskModal
        isOpen={isEditOpen}
        taskListId={task.taskListId}
        task={{ ...task, state: status }}
        onClose={closeEditModal}
      />
      <DeleteTaskModal
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
