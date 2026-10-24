import type { Task } from './task.model';

export interface TaskDto extends Task {
  taskListId: string;
  taskListName: string;
}
