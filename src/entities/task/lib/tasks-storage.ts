import 'server-only';

import type { Task } from '../model/task.model';
import {
  readDataFromFile,
  writeDataToFile,
} from '@/src/shared/lib/file-storage';

const TASKS_FILE_NAME = 'tasks.json';

export async function readTasks(): Promise<Task[]> {
  return readDataFromFile<Task[]>(TASKS_FILE_NAME);
}

export async function writeTasks(tasks: Task[]): Promise<void> {
  await writeDataToFile(TASKS_FILE_NAME, tasks);
}
