import { NextResponse } from 'next/server';
import { updateTaskBodySchema } from '@/src/entities/task';
import type { UpdateTaskBody } from '@/src/entities/task';
import {
  deleteTask,
  findTaskById,
  toTaskDto,
  updateTask,
} from '@/src/entities/task/lib';
import {
  findTaskListByTaskId,
  removeTaskIdFromTaskLists,
} from '@/src/entities/task-list/lib';
import { errorMessages } from '@/src/shared/config';
import {
  parseRequestJson,
  type ParseRequestResult,
} from '@/src/shared/lib/zod';
import type { TaskList } from '@/src/entities/task-list';

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const { taskItem } = await findTaskById(id);

  if (!taskItem) {
    return NextResponse.json(
      { error: errorMessages.error.taskNotFound },
      { status: 404 },
    );
  }

  const taskListItem: TaskList | undefined = await findTaskListByTaskId(id);
  if (!taskListItem) {
    return NextResponse.json(
      { error: errorMessages.error.taskListForTaskNotFound },
      { status: 404 },
    );
  }

  return NextResponse.json(toTaskDto(taskItem, taskListItem));
}

export async function PUT(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const { tasks, taskItem } = await findTaskById(id);

  if (!taskItem) {
    return NextResponse.json(
      { error: errorMessages.error.taskNotFound },
      { status: 404 },
    );
  }

  const updateTaskBody: ParseRequestResult<UpdateTaskBody> =
    await parseRequestJson(request, updateTaskBodySchema);
  if (!updateTaskBody.success) {
    return NextResponse.json(
      { error: errorMessages.validation.invalidJson },
      { status: 400 },
    );
  }

  await updateTask(id, tasks, taskItem, updateTaskBody.data);

  return NextResponse.json({ status: 200 });
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const { tasks, taskItem } = await findTaskById(id);

  if (!taskItem) {
    return NextResponse.json(
      { error: errorMessages.error.taskNotFound },
      { status: 404 },
    );
  }

  await deleteTask(id, tasks);
  await removeTaskIdFromTaskLists(id);

  return NextResponse.json({ status: 200 });
}
