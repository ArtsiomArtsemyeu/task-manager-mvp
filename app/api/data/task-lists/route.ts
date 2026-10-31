import type { Task } from '@/src/entities/task';
import { readTasks } from '@/src/entities/task/lib';
import { NextResponse } from 'next/server';
import { createTaskListBodySchema } from '@/src/entities/task-list';
import type { CreateTaskListBody, TaskList } from '@/src/entities/task-list';
import {
  createTaskList,
  readTaskLists,
  toTaskListsDto,
} from '@/src/entities/task-list/lib';
import { errorMessages } from '@/src/shared/config';
import { parseRequestJson } from '@/src/shared/lib/zod';
import type { ParseRequestResult } from '@/src/shared/lib/zod';

export async function GET() {
  const taskLists: TaskList[] = await readTaskLists();
  const tasks: Task[] = await readTasks();

  return NextResponse.json(toTaskListsDto(taskLists, tasks));
}

export async function POST(request: Request) {
  const createTaskListBody: ParseRequestResult<CreateTaskListBody> =
    await parseRequestJson(request, createTaskListBodySchema);

  if (!createTaskListBody.success) {
    return NextResponse.json(
      { error: errorMessages.validation.invalidJson },
      { status: 400 },
    );
  }

  const newTaskList: TaskList = await createTaskList(createTaskListBody.data);
  return NextResponse.json(newTaskList, { status: 201 });
}
