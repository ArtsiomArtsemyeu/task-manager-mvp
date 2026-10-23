import { NextResponse } from "next/server";
import type { Task } from "@/src/entities/task";
import type { TaskList, TaskListDto } from "@/src/entities/task-list";
import { errorMessages } from "@/src/shared/config";
import { readDataFromFile, writeDataToFile } from "@/src/shared/lib/file-storage";
import { isRecord, readJson } from "@/src/shared/utils/type-guard";

const TASKS_FILE_NAME = "tasks.json";
const TASK_LISTS_FILE_NAME = "task-lists.json";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;

  const taskLists = await readDataFromFile<TaskList[]>(TASK_LISTS_FILE_NAME);
  const taskListItem = taskLists.find(
    (taskList: TaskList) => taskList.id === id,
  );

  if (!taskListItem) {
    return NextResponse.json({ error: errorMessages.error.taskListNotFound }, { status: 404 });
  }

  const tasks = await readDataFromFile<Task[]>(TASKS_FILE_NAME);
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

  const taskLists = await readDataFromFile<TaskList[]>(TASK_LISTS_FILE_NAME);
  const taskListItem = taskLists.find(
    (taskList: TaskList) => taskList.id === id,
  );

  if (!taskListItem) {
    return NextResponse.json({ error: errorMessages.error.taskListNotFound }, { status: 404 });
  }

  const body = await readJson(request);

  if (!isRecord(body) || typeof body.name !== "string") {
    return NextResponse.json(
      { error: errorMessages.validation.invalidJson },
      { status: 400 },
    );
  }

  const updatedName = body.name;

  const updatedTaskList: TaskList[] = taskLists.map((taskList: TaskList) =>
    taskList.id === id ? { ...taskList, name: updatedName } : taskList,
  );
  await writeDataToFile(TASK_LISTS_FILE_NAME, updatedTaskList);

  return NextResponse.json({ status: 200 });
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id } = await params;

  const taskLists = await readDataFromFile<TaskList[]>(TASK_LISTS_FILE_NAME);
  const taskListItem = taskLists.find(
    (taskList: TaskList) => taskList.id === id,
  );

  if (!taskListItem) {
    return NextResponse.json({ error: errorMessages.error.taskListNotFound }, { status: 404 });
  }

  const updatedTaskLists = taskLists.filter(
    (taskList: TaskList) => taskList.id !== id,
  );
  await writeDataToFile(TASK_LISTS_FILE_NAME, updatedTaskLists);

  return NextResponse.json({ status: 200 });
}
