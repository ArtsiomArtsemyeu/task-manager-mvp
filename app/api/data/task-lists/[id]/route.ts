import { NextResponse } from "next/server";
import { TaskList } from "@/src/entities/task-list";
import { readDataFromFile, writeDataToFile } from "@/src/data/utils/file.util";

const TASK_LISTS_FILE_NAME = "task-lists.json";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, { params }: RouteParams) {
  const { id } = await params;

  const taskLists = await readDataFromFile<TaskList[]>(TASK_LISTS_FILE_NAME);
  const taskListItem = taskLists.find(
    (taskList: TaskList) => taskList.id === id,
  );

  if (!taskListItem) {
    return NextResponse.json({ error: "Список не найден" }, { status: 404 });
  }

  return NextResponse.json(taskListItem);
}

export async function PUT(request: Request, { params }: RouteParams) {
  const { id } = await params;

  const taskLists = await readDataFromFile<TaskList[]>(TASK_LISTS_FILE_NAME);
  const taskListItem = taskLists.find(
    (taskList: TaskList) => taskList.id === id,
  );

  if (!taskListItem) {
    return NextResponse.json({ error: "Список не найден" }, { status: 404 });
  }

  const body = await request.json();
  const updatedName = body.name;

  const updatedTaskList: TaskList[] = taskLists.map((taskList: TaskList) =>
    taskList.id === id ? { ...taskList, name: updatedName } : taskList,
  );

  await writeDataToFile(TASK_LISTS_FILE_NAME, updatedTaskList);

  return NextResponse.json({ status: 200 });
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const { id } = await params;

  const taskLists = await readDataFromFile<TaskList[]>(TASK_LISTS_FILE_NAME);
  const taskListItem = taskLists.find(
    (taskList: TaskList) => taskList.id === id,
  );

  if (!taskListItem) {
    return NextResponse.json({ error: "Список не найден" }, { status: 404 });
  }

  const itemIndex = taskLists.findIndex(
    (taskList: TaskList) => taskList.id === id,
  );

  const updatedTaskList: TaskList[] = taskLists.splice(itemIndex, 1);

  await writeDataToFile(TASK_LISTS_FILE_NAME, updatedTaskList);

  return NextResponse.json({ status: 200 });
}
