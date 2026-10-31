import 'server-only';

import { v4 as uuidv4 } from 'uuid';
import type { TaskList } from '../model/task-list.model';
import { readTaskLists, writeTaskLists } from './task-lists-storage';
import { defaultUser } from '@/src/shared/config';

type CreateTaskListInput = {
  name: string;
  taskIds?: string[];
};

export async function createTaskList(
  input: CreateTaskListInput,
): Promise<TaskList> {
  const newTaskList: TaskList = {
    id: uuidv4(),
    name: input.name,
    userId: defaultUser.id,
    taskIds: input.taskIds ?? [],
  };

  const taskLists = await readTaskLists();
  taskLists.push(newTaskList);
  await writeTaskLists(taskLists);

  return newTaskList;
}

export async function addTaskIdToTaskList(
  taskListId: string,
  taskId: string,
): Promise<void> {
  const taskLists = await readTaskLists();
  const updatedTaskLists = taskLists.map((taskList) =>
    taskList.id === taskListId
      ? { ...taskList, taskIds: [...taskList.taskIds, taskId] }
      : taskList,
  );
  await writeTaskLists(updatedTaskLists);
}
