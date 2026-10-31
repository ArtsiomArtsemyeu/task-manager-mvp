import { NextResponse } from 'next/server';
import { readTasks } from '@/src/entities/task/lib';
import { updateTaskListBodySchema } from '@/src/entities/task-list';
import type { TaskList, UpdateTaskListBody } from '@/src/entities/task-list';
import {
  readTaskLists,
  toTaskListDto,
  writeTaskLists,
} from '@/src/entities/task-list/lib';
import { errorMessages } from '@/src/shared/config';
import { parseRequestJson, type ParseRequestResult } from '@/src/shared/lib/zod';
import type { Task } from '@/src/entities/task';

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;

  const taskLists: TaskList[] = await readTaskLists();
  const taskListItem: TaskList | undefined = taskLists.find(
    (taskList: TaskList) => taskList.id === id,
  );

  if (!taskListItem) {
    return NextResponse.json(
      { error: errorMessages.error.taskListNotFound },
      { status: 404 },
    );
  }

  const tasks: Task[] = await readTasks();
  return NextResponse.json(toTaskListDto(taskListItem, tasks));
}

export async function PUT(request: Request, { params }: RouteParams) {
  const { id } = await params;

  const taskLists: TaskList[] = await readTaskLists();
  const taskListItem: TaskList | undefined = taskLists.find(
    (taskList: TaskList) => taskList.id === id,
  );

  if (!taskListItem) {
    return NextResponse.json(
      { error: errorMessages.error.taskListNotFound },
      { status: 404 },
    );
  }

  const updateTaskListBody: ParseRequestResult<UpdateTaskListBody> = await parseRequestJson(
    request,
    updateTaskListBodySchema,
  );

  if (!updateTaskListBody.success) {
    return NextResponse.json(
      { error: errorMessages.validation.invalidJson },
      { status: 400 },
    );
  }

  const updatedTaskList: TaskList[] = taskLists.map((taskList: TaskList) =>
    taskList.id === id
      ? { ...taskList, name: updateTaskListBody.data.name }
      : taskList,
  );
  await writeTaskLists(updatedTaskList);

  return NextResponse.json({ status: 200 });
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id } = await params;

  const taskLists: TaskList[] = await readTaskLists();
  const taskListItem: TaskList | undefined = taskLists.find(
    (taskList: TaskList) => taskList.id === id,
  );

  if (!taskListItem) {
    return NextResponse.json(
      { error: errorMessages.error.taskListNotFound },
      { status: 404 },
    );
  }

  const updatedTaskLists: TaskList[] = taskLists.filter(
    (taskList: TaskList) => taskList.id !== id,
  );
  await writeTaskLists(updatedTaskLists);

  return NextResponse.json({ status: 200 });
}
