"use client";

import Image from "next/image";
import Link from "next/link";
import { clsx } from "clsx";
import { startTransition, useCallback, useMemo, useState } from "react";
import styles from "./task-list-details.module.css";
import { AddTaskModal } from "@/src/features/add-task-modal";
import { EditTaskModal } from "@/src/features/edit-task-modal";
import { DeleteTaskModal } from "@/src/features/delete-task-modal";
import { changeTaskStatusAction } from "@/src/features/change-task-status";
import {
  Task,
  TASK_PRIORITY_LABELS,
  TASK_STATE_LABELS,
  TASK_STATES,
  TaskPriority,
  TaskState,
  calculateTaskListProgress,
  formatTaskDueDate,
  isDeadlineWithin48Hours,
  isTaskPriority,
  isTaskState,
  sortTasks,
} from "@/src/entities/task";
import { TaskListDto } from "@/src/entities/task-list";
import { ProgressBar } from "@/src/shared/ui/components/progress-bar";

type StatusFilter = "all" | TaskState;

type TaskListDetailsProps = {
  taskList: TaskListDto;
};

function getPriorityClass(priority: number): string {
  if (priority >= 3) {
    return styles.priorityHigh;
  }
  if (priority === 2) {
    return styles.priorityMedium;
  }
  return styles.priorityLow;
}

export function TaskListDetailsWidget({ taskList }: TaskListDetailsProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const progress = useMemo(
    () => calculateTaskListProgress(taskList.tasks),
    [taskList.tasks],
  );

  const filteredTasks = useMemo(() => {
    const tasks =
      statusFilter === "all"
        ? taskList.tasks
        : taskList.tasks.filter((task) => task.state === statusFilter);

    return sortTasks(tasks);
  }, [statusFilter, taskList.tasks]);

  const openAddModal = useCallback(() => setIsAddOpen(true), []);
  const closeAddModal = useCallback(() => setIsAddOpen(false), []);
  const closeEditModal = useCallback(() => setEditingTask(null), []);
  const closeDeleteModal = useCallback(() => setDeletingTask(null), []);

  const onStatusChange = useCallback(
    (taskId: string, nextState: TaskState) => {
      startTransition(() => {
        void changeTaskStatusAction(taskId, taskList.id, nextState);
      });
    },
    [taskList.id],
  );

  return (
    <div className={styles.host}>
      <header className={styles.header}>
        <Link href="/lists" className={styles.backLink}>
          ← К спискам
        </Link>

        <div className={styles.topGrid}>
          <h1 className={styles.title}>{taskList.name}</h1>

          <div className={styles.rightCol}>
            <span className={styles.metaLabel}>
              Количество задач: {taskList.tasks.length}
            </span>
            <div className={styles.progressWrap}>
              <span className={styles.metaLabel}>Прогресс {progress}%</span>
              <div className={styles.progressBar}>
                <ProgressBar progress={progress} />
              </div>
            </div>
            <button
              type="button"
              className={styles.addButton}
              onClick={openAddModal}
            >
              Добавить задачу
            </button>
          </div>

          <div
            className={styles.filters}
            role="group"
            aria-label="Фильтр по статусу"
          >
            <button
              type="button"
              className={clsx(
                styles.filterBtn,
                statusFilter === "all" && styles.filterBtnActive,
              )}
              onClick={() => setStatusFilter("all")}
            >
              Все
            </button>
            {TASK_STATES.map((state) => (
              <button
                key={state}
                type="button"
                className={clsx(
                  styles.filterBtn,
                  statusFilter === state && styles.filterBtnActive,
                )}
                onClick={() => setStatusFilter(state)}
              >
                {TASK_STATE_LABELS[state]}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className={styles.tableCard}>
        {filteredTasks.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>Задач не найдено</p>
            <p className={styles.emptyText}>
              {statusFilter === "all"
                ? "Создайте первую задачу для этого списка."
                : "Попробуйте другой фильтр статуса."}
            </p>
          </div>
        ) : (
          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Название</th>
                  <th scope="col">Статус</th>
                  <th scope="col">Приоритет</th>
                  <th scope="col">Дедлайн</th>
                  <th scope="col">Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => {
                  const priority = isTaskPriority(task.priority)
                    ? task.priority
                    : (2 as TaskPriority);
                  const isOverdue = task.state === "overdue";
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
                          aria-label={`Статус задачи ${task.name}`}
                          value={isTaskState(task.state) ? task.state : "new"}
                          onChange={(event) => {
                            if (isTaskState(event.target.value)) {
                              onStatusChange(task.id, event.target.value);
                            }
                          }}
                        >
                          {TASK_STATES.map((state) => (
                            <option key={state} value={state}>
                              {TASK_STATE_LABELS[state]}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <span
                          className={clsx(
                            styles.priority,
                            getPriorityClass(priority),
                          )}
                        >
                          {TASK_PRIORITY_LABELS[priority]}
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
                            aria-label={`Редактировать задачу ${task.name}`}
                            onClick={() => setEditingTask(task)}
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
                            className={clsx(
                              styles.iconButton,
                              styles.iconButtonDanger,
                            )}
                            aria-label={`Удалить задачу ${task.name}`}
                            onClick={() => setDeletingTask(task)}
                          >
                            <Image
                              src="/images/icons/trash.svg"
                              alt="Удалить"
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

      <AddTaskModal
        isOpen={isAddOpen}
        taskListId={taskList.id}
        onClose={closeAddModal}
      />
      <EditTaskModal
        isOpen={!!editingTask}
        taskListId={taskList.id}
        task={editingTask}
        onClose={closeEditModal}
      />
      {deletingTask ? (
        <DeleteTaskModal
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
