import 'server-only';

import type { Task } from '@/src/entities/task/@x/task-list';
import type { TaskListDto } from '../model/task-list-dto.model';
import type { TaskList } from '../model/task-list.model';
import { readTaskLists } from './task-lists-storage';

export async function findTaskListByTaskId(
  taskId: string,
): Promise<TaskList | undefined> {
  const taskLists = await readTaskLists();

  return taskLists.find((taskList) => taskList.taskIds.includes(taskId));
}

export function toTaskListDto(
  taskList: TaskList,
  tasks: Task[],
): TaskListDto {
  return {
    id: taskList.id,
    name: taskList.name,
    userId: taskList.userId,
    tasks: taskList.taskIds
      .map((taskId) => tasks.find((task) => task.id === taskId))
      .filter((taskItem): taskItem is Task => !!taskItem),
  };
}

export function toTaskListsDto(
  taskLists: TaskList[],
  tasks: Task[],
): TaskListDto[] {
  return taskLists.map((taskList) => toTaskListDto(taskList, tasks));
}
