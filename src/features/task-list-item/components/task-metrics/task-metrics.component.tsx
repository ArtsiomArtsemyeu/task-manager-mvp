import { useMemo } from "react";
import { Task } from "@/src/entities/task";
import { calculateTaskCountByState } from "@/src/entities/task/utils/task.util";

type TaskMetricsProps = {
  tasks: Task[];
};

export function TaskMetrics({ tasks }: TaskMetricsProps) {
  const newTaskCount = useMemo(
    () => calculateTaskCountByState(tasks, "new"),
    [tasks],
  );
  const inProgressTaskCount = useMemo(
    () => calculateTaskCountByState(tasks, "in-progress"),
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
    <div>
      <div>{`Новые: ${newTaskCount}`}</div>
      <div>{`В работе: ${inProgressTaskCount}`}</div>
      <div>{`Выполненные: ${doneTaskCount}`}</div>
      <div>{`Просроченные: ${overdueTaskCount}`}</div>
    </div>
  );
}
