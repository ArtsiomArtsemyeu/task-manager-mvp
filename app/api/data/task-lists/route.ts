import type { Task } from '@/src/entities/task';
import { readTasks } from '@/src/entities/task/lib';
import { NextResponse } from 'next/server';
import type { TaskList, TaskListDto } from '@/src/entities/task-list';
import { createTaskList, readTaskLists } from '@/src/entities/task-list/lib';
import { errorMessages } from '@/src/shared/config';
import {
  isRecord,
  isStringArray,
  readJson,
} from '@/src/shared/utils/type-guard';

export async function GET() {
  const taskLists = await readTaskLists();
  const tasks = await readTasks();

  const taskListsDto: TaskListDto[] = taskLists.map(
    (taskListItem: TaskList) => ({
      id: taskListItem.id,
      name: taskListItem.name,
      userId: taskListItem.userId,
      tasks: taskListItem.taskIds
        .map((taskId: string) => tasks.find((task: Task) => taskId === task.id))
        .filter((taskItem: Task | undefined) => !!taskItem),
    }),
  );

  return NextResponse.json(taskListsDto);
}

export async function POST(request: Request) {
  try {
    const body = await readJson(request);

    if (!isRecord(body) || typeof body.name !== 'string') {
      return NextResponse.json(
        { error: errorMessages.validation.invalidJson },
        { status: 400 },
      );
    }

    const newTaskList = await createTaskList({
      name: body.name,
      taskIds: isStringArray(body.taskIds) ? body.taskIds : undefined,
    });

    return NextResponse.json(newTaskList, { status: 201 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: errorMessages.validation.invalidJson },
      { status: 400 },
    );
  }
}
