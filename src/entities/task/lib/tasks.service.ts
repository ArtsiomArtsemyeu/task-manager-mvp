import 'server-only';

import { v4 as uuidv4 } from 'uuid';
import type { TaskState } from '../config/task.config';
import type { Task } from '../model/task.model';
import { readTasks, writeTasks } from './tasks-storage';

type CreateTaskInput = {
  name: string;
  description: string;
  state: TaskState;
  priority: number;
  dueDate: string;
};

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const newTask: Task = {
    id: uuidv4(),
    name: input.name,
    description: input.description,
    state: input.state,
    priority: input.priority,
    dueDate: input.dueDate,
  };

  const tasks = await readTasks();
  tasks.push(newTask);
  await writeTasks(tasks);

  return newTask;
}
