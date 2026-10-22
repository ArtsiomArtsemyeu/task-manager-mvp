"use client";

import Link from "next/link";
import { useMemo } from "react";
import styles from "./task-list-item.module.css";
import { TaskMetrics } from "./ui/task-metrics/task-metrics";
import {
  calculateTaskCountByState,
  calculateTaskListProgress,
  isDeadlineWithin48Hours,
} from "@/src/entities/task";
import { TaskListDto } from "@/src/entities/task-list";
import { ProgressBar } from "@/src/shared/ui/components/progress-bar";
import { Chip } from "@/src/shared/ui/components/chip";

interface TaskListItemProps {
  taskList: TaskListDto;
}

export function TaskListItem({ taskList }: TaskListItemProps) {
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

  return (
    <Link href={`/lists/${taskList.id}`} className={styles.link}>
      <div className={styles.host}>
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
      </div>
    </Link>
  );
}
