import { useMemo } from "react";
import styles from "./task-metrics.module.css";
import { Task, calculateTaskCountByState } from "@/src/entities/task";

type TaskMetricsProps = {
  tasks: Task[];
};

export function TaskMetrics({ tasks }: TaskMetricsProps) {
  const newTaskCount = useMemo(
    () => calculateTaskCountByState(tasks, "new"),
    [tasks],
  );
  const inProgressTaskCount = useMemo(
    () => calculateTaskCountByState(tasks, "in progress"),
    [tasks],
  );
  const doneTaskCount = useMemo(
    () => calculateTaskCountByState(tasks, "done"),
    [tasks],
  );
  const overdueTaskCount = useMemo(
    () => calculateTaskCountByState(tasks, "overdue"),
    [tasks],
  );

  return (
    <div className={styles.host}>
      <div className={styles.item}>
        <span className={styles.label}>Новые</span>
        <span className={`${styles.value} ${styles.new}`}>{newTaskCount}</span>
      </div>
      <div className={styles.item}>
        <span className={styles.label}>В работе</span>
        <span className={`${styles.value} ${styles.progress}`}>
          {inProgressTaskCount}
        </span>
      </div>
      <div className={styles.item}>
        <span className={styles.label}>Выполненные</span>
        <span className={`${styles.value} ${styles.done}`}>
          {doneTaskCount}
        </span>
      </div>
      <div className={styles.item}>
        <span className={styles.label}>Просроченные</span>
        <span className={`${styles.value} ${styles.overdue}`}>
          {overdueTaskCount}
        </span>
      </div>
    </div>
  );
}
