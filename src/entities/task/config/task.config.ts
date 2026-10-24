export const TASK_STATES = ['new', 'in progress', 'done', 'overdue'] as const;

export type TaskState = (typeof TASK_STATES)[number];

export const TASK_STATE_LABELS: Record<TaskState, string> = {
  new: 'Новая',
  'in progress': 'В работе',
  done: 'Выполнена',
  overdue: 'Просрочена',
};

export const TASK_PRIORITIES = [1, 2, 3] as const;

export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  1: 'Низкий',
  2: 'Средний',
  3: 'Высокий',
};

export function isTaskState(value: string): value is TaskState {
  return (TASK_STATES as readonly string[]).includes(value);
}

export function isTaskPriority(value: number): value is TaskPriority {
  return (TASK_PRIORITIES as readonly number[]).includes(value);
}
