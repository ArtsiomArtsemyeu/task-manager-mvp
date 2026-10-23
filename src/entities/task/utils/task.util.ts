import type { TaskState } from "../config/task.config";
import type { Task } from "../model/task.model";

export const calculateTaskCountByState = (
  tasks: Task[],
  state: TaskState,
): number => tasks.filter((taskItem: Task) => taskItem.state === state).length;

export const calculateTaskListProgress = (tasks: Task[]): number => {
  if (tasks.length === 0) {
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

const isDoneTask = (task: Task): boolean => task.state === "done";

const isIncompleteOverdueTask = (task: Task): boolean => {
  if (isDoneTask(task)) {
    return false;
  }

  if (task.state === "overdue") {
    return true;
  }

  const dueTime = new Date(task.dueDate).getTime();
  return !Number.isNaN(dueTime) && dueTime < Date.now();
};

const getDueTime = (task: Task): number => {
  const dueTime = new Date(task.dueDate).getTime();
  return Number.isNaN(dueTime) ? Number.POSITIVE_INFINITY : dueTime;
};

export const compareTasks = (left: Task, right: Task): number => {
  const leftDone = isDoneTask(left);
  const rightDone = isDoneTask(right);

  if (leftDone !== rightDone) {
    return leftDone ? 1 : -1;
  }

  const leftOverdue = isIncompleteOverdueTask(left);
  const rightOverdue = isIncompleteOverdueTask(right);

  if (leftOverdue !== rightOverdue) {
    return leftOverdue ? -1 : 1;
  }

  const dueDiff = getDueTime(left) - getDueTime(right);
  if (dueDiff !== 0) {
    return dueDiff;
  }

  return right.priority - left.priority;
};

export const sortTasks = (tasks: Task[]): Task[] =>
  [...tasks].sort(compareTasks);

export const formatTaskDueDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};
