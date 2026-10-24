import { NextResponse } from 'next/server';
import { isTaskState } from '@/src/entities/task';
import type { Task, TaskDto } from '@/src/entities/task';
import type { TaskList } from '@/src/entities/task-list';
import { errorMessages } from '@/src/shared/config';
import {
  readDataFromFile,
  writeDataToFile,
} from '@/src/shared/lib/file-storage';
import { isRecord, readJson } from '@/src/shared/utils/type-guard';

function optionalString(value: unknown, fallback: string): string | null {
  if (value == null) {
    return fallback;
  }

  return typeof value === 'string' ? value : null;
}

const TASKS_FILE_NAME = 'tasks.json';
const TASK_LISTS_FILE_NAME = 'task-lists.json';

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;

  const tasks = await readDataFromFile<Task[]>(TASKS_FILE_NAME);
  const taskItem = tasks.find((task: Task) => task.id === id);

  if (!taskItem) {
    return NextResponse.json(
      { error: errorMessages.error.taskNotFound },
      { status: 404 },
    );
  }

  const taskLists = await readDataFromFile<TaskList[]>(TASK_LISTS_FILE_NAME);
  const taskListItem = taskLists.find((taskList: TaskList) =>
    taskList.taskIds.includes(id),
  );

  if (!taskListItem) {
    return NextResponse.json(
      { error: errorMessages.error.taskListForTaskNotFound },
      { status: 404 },
    );
  }

  const taskDto: TaskDto = {
    ...taskItem,
    taskListId: taskListItem.id,
    taskListName: taskListItem.name,
  };

  return NextResponse.json(taskDto);
}

export async function PUT(request: Request, { params }: RouteParams) {
  const { id } = await params;

  const tasks = await readDataFromFile<Task[]>(TASKS_FILE_NAME);
  const taskItem = tasks.find((task: Task) => task.id === id);

  if (!taskItem) {
    return NextResponse.json(
      { error: errorMessages.error.taskNotFound },
      { status: 404 },
    );
  }

  try {
    const body = await readJson(request);

    if (!isRecord(body)) {
      return NextResponse.json(
        { error: errorMessages.validation.invalidJson },
        { status: 400 },
      );
    }

    const name = optionalString(body.name, taskItem.name);
    const description = optionalString(body.description, taskItem.description);
    const dueDate = optionalString(body.dueDate, taskItem.dueDate);
    const state = body.state == null ? taskItem.state : body.state;
    const priority = body.priority == null ? taskItem.priority : body.priority;

    if (
      name === null ||
      description === null ||
      dueDate === null ||
      typeof state !== 'string' ||
      !isTaskState(state) ||
      typeof priority !== 'number'
    ) {
      return NextResponse.json(
        { error: errorMessages.validation.invalidJson },
        { status: 400 },
      );
    }

    const updatedTasks = tasks.map((task: Task) =>
      task.id === id
        ? {
            ...task,
            name,
            description,
            state,
            priority,
            dueDate,
          }
        : task,
    );

    await writeDataToFile(TASKS_FILE_NAME, updatedTasks);

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: errorMessages.validation.invalidJson },
      { status: 400 },
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id } = await params;

  const tasks = await readDataFromFile<Task[]>(TASKS_FILE_NAME);
  const taskItem = tasks.find((task: Task) => task.id === id);

  if (!taskItem) {
    return NextResponse.json(
      { error: errorMessages.error.taskNotFound },
      { status: 404 },
    );
  }

  const updatedTasks = tasks.filter((task: Task) => task.id !== id);
  await writeDataToFile(TASKS_FILE_NAME, updatedTasks);

  const taskLists = await readDataFromFile<TaskList[]>(TASK_LISTS_FILE_NAME);
  const updatedTaskLists = taskLists.map((taskList: TaskList) => ({
    ...taskList,
    taskIds: taskList.taskIds.filter((taskId: string) => taskId !== id),
  }));
  await writeDataToFile(TASK_LISTS_FILE_NAME, updatedTaskLists);

  return NextResponse.json({ status: 200 });
}
