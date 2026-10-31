import { isTaskState } from '@/src/entities/task';
import { createTask, readTasks } from '@/src/entities/task/lib';
import { addTaskIdToTaskList } from '@/src/entities/task-list/lib';
import { NextResponse } from 'next/server';
import { errorMessages } from '@/src/shared/config';
import { isRecord, readJson } from '@/src/shared/utils/type-guard';

export async function GET() {
  const tasks = await readTasks();
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  try {
    const body = await readJson(request);

    if (
      !isRecord(body) ||
      typeof body.name !== 'string' ||
      typeof body.description !== 'string' ||
      typeof body.state !== 'string' ||
      !isTaskState(body.state) ||
      typeof body.priority !== 'number' ||
      typeof body.dueDate !== 'string' ||
      typeof body.taskListId !== 'string'
    ) {
      return NextResponse.json(
        { error: errorMessages.validation.invalidJson },
        { status: 400 },
      );
    }

    const newTask = await createTask({
      name: body.name,
      description: body.description,
      state: body.state,
      priority: body.priority,
      dueDate: body.dueDate,
    });
    await addTaskIdToTaskList(body.taskListId, newTask.id);

    return NextResponse.json({ status: 201 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: errorMessages.validation.invalidJson },
      { status: 400 },
    );
  }
}
