import {
  createTaskBodySchema,
  type CreateTaskBody,
  type Task,
} from '@/src/entities/task';
import { createTask, readTasks } from '@/src/entities/task/lib';
import { addTaskIdToTaskList } from '@/src/entities/task-list/lib';
import { NextResponse } from 'next/server';
import { errorMessages } from '@/src/shared/config';
import {
  parseRequestJson,
  type ParseRequestResult,
} from '@/src/shared/lib/zod';

export async function GET() {
  const tasks: Task[] = await readTasks();
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  const createTaskBody: ParseRequestResult<CreateTaskBody> =
    await parseRequestJson(request, createTaskBodySchema);

  if (!createTaskBody.success) {
    return NextResponse.json(
      { error: errorMessages.validation.invalidJson },
      { status: 400 },
    );
  }

  const newTask: Task = await createTask(createTaskBody.data);
  await addTaskIdToTaskList(createTaskBody.data.taskListId, newTask.id);

  return NextResponse.json({ status: 201 });
}
