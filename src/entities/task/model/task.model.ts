import type { TaskState } from '../config/task.config';

export interface Task {
  id: string;
  name: string;
  description: string;
  state: TaskState;
  priority: number;
  dueDate: string;
}
