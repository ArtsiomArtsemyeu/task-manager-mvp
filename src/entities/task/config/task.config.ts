export const TASK_STATES = ['new', 'in progress', 'done', 'overdue'] as const;

export type TaskState = (typeof TASK_STATES)[number];

export const TASK_PRIORITIES = [1, 2, 3] as const;

export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export function isTaskState(value: string): value is TaskState {
  return (TASK_STATES as readonly string[]).includes(value);
}

export function isTaskPriority(value: number): value is TaskPriority {
  return (TASK_PRIORITIES as readonly number[]).includes(value);
}
