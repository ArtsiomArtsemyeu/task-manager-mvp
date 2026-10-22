import { Task } from "../model/task.model";

export const calculateTaskCountByState = (
  tasks: Task[],
  state: string,
): number => tasks.filter((taskItem: Task) => taskItem.state === state).length;

export const calculateTaskListProgress = (tasks: Task[]): number => {
  if (!tasks || tasks.length === 0) {
    return 0;
  }

  const completedCount = tasks.filter((task) => task.state === "done").length;
  const percentage = (completedCount / tasks.length) * 100;

  return Math.round(percentage);
};

export const isDeadlineWithin48Hours = (task: Task): boolean => {
  const diff = new Date(task.dueDate).getTime() - Date.now();
  return diff > 0 && diff <= 172_800_000;
};
