import 'server-only';

import type { TaskList } from '../model/task-list.model';
import {
  readDataFromFile,
  writeDataToFile,
} from '@/src/shared/lib/file-storage';

const TASK_LISTS_FILE_NAME = 'task-lists.json';

export async function readTaskLists(): Promise<TaskList[]> {
  return readDataFromFile<TaskList[]>(TASK_LISTS_FILE_NAME);
}

export async function writeTaskLists(taskLists: TaskList[]): Promise<void> {
  await writeDataToFile(TASK_LISTS_FILE_NAME, taskLists);
}
