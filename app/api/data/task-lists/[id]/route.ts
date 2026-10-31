import { NextResponse } from 'next/server';
import type { Task } from '@/src/entities/task';
import { readTasks } from '@/src/entities/task/lib';
import type { TaskList, TaskListDto } from '@/src/entities/task-list';
import { readTaskLists, writeTaskLists } from '@/src/entities/task-list/lib';
import { errorMessages } from '@/src/shared/config';
import { isRecord, readJson } from '@/src/shared/utils/type-guard';

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;

  const taskLists = await readTaskLists();
  const taskListItem = taskLists.find(
    (taskList: TaskList) => taskList.id === id,
  );

  if (!taskListItem) {
    return NextResponse.json(
      { error: errorMessages.error.taskListNotFound },
      { status: 404 },
    );
  }

  const tasks = await readTasks();
  const taskListDto: TaskListDto = {
    id: taskListItem.id,
    name: taskListItem.name,
    userId: taskListItem.userId,
    tasks: taskListItem.taskIds
      .map((taskId: string) => tasks.find((task: Task) => task.id === taskId))
      .filter((taskItem: Task | undefined): taskItem is Task => !!taskItem),
  };

  return NextResponse.json(taskListDto);
}

export async function PUT(request: Request, { params }: RouteParams) {
  const { id } = await params;

  const taskLists = await readTaskLists();
  const taskListItem = taskLists.find(
    (taskList: TaskList) => taskList.id === id,
  );

  if (!taskListItem) {
    return NextResponse.json(
      { error: errorMessages.error.taskListNotFound },
      { status: 404 },
    );
  }

  const body = await readJson(request);

  if (!isRecord(body) || typeof body.name !== 'string') {
    return NextResponse.json(
      { error: errorMessages.validation.invalidJson },
      { status: 400 },
    );
  }

  const updatedName = body.name;

  const updatedTaskList: TaskList[] = taskLists.map((taskList: TaskList) =>
    taskList.id === id ? { ...taskList, name: updatedName } : taskList,
  );
  await writeTaskLists(updatedTaskList);

  return NextResponse.json({ status: 200 });
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id } = await params;

  const taskLists = await readTaskLists();
  const taskListItem = taskLists.find(
    (taskList: TaskList) => taskList.id === id,
  );

  if (!taskListItem) {
    return NextResponse.json(
      { error: errorMessages.error.taskListNotFound },
      { status: 404 },
    );
  }

  const updatedTaskLists = taskLists.filter(
    (taskList: TaskList) => taskList.id !== id,
  );
  await writeTaskLists(updatedTaskLists);

  return NextResponse.json({ status: 200 });
}
