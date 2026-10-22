"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import styles from "./task-list-card.module.css";
import { TaskMetrics } from "./ui/task-metrics/task-metrics";
import { CardMenu } from "./ui/card-menu/card-menu";
import { RenameTaskListModal } from "./ui/rename-task-list-modal/rename-task-list-modal";
import { DeleteTaskListModal } from "./ui/delete-task-list-modal/delete-task-list-modal";
import {
  calculateTaskCountByState,
  calculateTaskListProgress,
  isDeadlineWithin48Hours,
} from "@/src/entities/task";
import { TaskListDto } from "@/src/entities/task-list";
import { ProgressBar } from "@/src/shared/ui/components/progress-bar";
import { Chip } from "@/src/shared/ui/components/chip";

interface TaskListCardProps {
  taskList: TaskListDto;
}

export function TaskListCard({ taskList }: TaskListCardProps) {
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const taskListProgress = useMemo(
    () => calculateTaskListProgress(taskList.tasks),
    [taskList],
  );

  const hasOverdueTasks = useMemo(
    () => calculateTaskCountByState(taskList.tasks, "overdue") > 0,
    [taskList],
  );

  const hasDeadlineTasks = useMemo(
    () => taskList.tasks.filter(isDeadlineWithin48Hours).length > 0,
    [taskList],
  );

  const openRenameModal = useCallback(() => setIsRenameOpen(true), []);
  const closeRenameModal = useCallback(() => setIsRenameOpen(false), []);
  const openDeleteModal = useCallback(() => setIsDeleteOpen(true), []);
  const closeDeleteModal = useCallback(() => setIsDeleteOpen(false), []);

  return (
    <div className={styles.host}>
      <CardMenu onRename={openRenameModal} onDelete={openDeleteModal} />

      <Link href={`/lists/${taskList.id}`} className={styles.link}>
        <div className={styles.title}>{taskList.name}</div>
        <div className={styles.count}>
          {`Количество задач: ${taskList.tasks.length}`}
        </div>
        <TaskMetrics tasks={taskList.tasks} />
        <ProgressBar progress={taskListProgress} />
        <div className={styles.indicators}>
          {hasOverdueTasks && (
            <Chip label="Есть просроченные задачи" color="red" />
          )}
          {hasDeadlineTasks && (
            <Chip label="Дедлайн в ближайшие 48 часов" color="yellow" />
          )}
        </div>
      </Link>

      <RenameTaskListModal
        isOpen={isRenameOpen}
        taskListId={taskList.id}
        currentName={taskList.name}
        onClose={closeRenameModal}
      />
      <DeleteTaskListModal
        isOpen={isDeleteOpen}
        taskListId={taskList.id}
        taskListName={taskList.name}
        onClose={closeDeleteModal}
      />
    </div>
  );
}
