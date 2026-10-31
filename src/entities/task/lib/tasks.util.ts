import 'server-only';

import { v4 as uuidv4 } from 'uuid';
import type { TaskDto } from '../model/task-dto.model';
import type { Task } from '../model/task.model';
import type { CreateTaskBody, UpdateTaskBody } from '../model/task.schema';
import { readTasks, writeTasks } from './tasks-storage';

type TaskListRef = {
  id: string;
  name: string;
};

export function toTaskDto(task: Task, taskList: TaskListRef): TaskDto {
  return {
    ...task,
    taskListId: taskList.id,
    taskListName: taskList.name,
  };
}

export async function findTaskById(id: string): Promise<{
  tasks: Task[];
  taskItem: Task | undefined;
}> {
  const tasks = await readTasks();
  const taskItem = tasks.find((task) => task.id === id);

  return { tasks, taskItem };
}

export async function createTask(body: CreateTaskBody): Promise<Task> {
  const newTask: Task = {
    id: uuidv4(),
    name: body.name,
    description: body.description,
    state: body.state,
    priority: body.priority,
    dueDate: body.dueDate,
  };

  const tasks = await readTasks();
  tasks.push(newTask);
  await writeTasks(tasks);

  return newTask;
}

export async function updateTask(
  id: string,
  tasks: Task[],
  taskItem: Task,
  updates: UpdateTaskBody,
): Promise<void> {
  const updatedTasks = tasks.map((task) =>
    task.id === id
      ? {
          ...task,
          name: updates.name ?? taskItem.name,
          description: updates.description ?? taskItem.description,
          state: updates.state ?? taskItem.state,
          priority: updates.priority ?? taskItem.priority,
          dueDate: updates.dueDate ?? taskItem.dueDate,
        }
      : task,
  );

  await writeTasks(updatedTasks);
}

export async function deleteTask(id: string, tasks: Task[]): Promise<void> {
  const updatedTasks = tasks.filter((task) => task.id !== id);
  await writeTasks(updatedTasks);
}
