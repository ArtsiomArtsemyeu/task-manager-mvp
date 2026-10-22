import { NextResponse } from "next/server";
import { Task } from "@/src/entities/task";
import { readDataFromFile, writeDataToFile } from "@/src/data/utils/file.util";

const TASKS_FILE_NAME = "tasks.json";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function DELETE(request: Request, { params }: RouteParams) {
  const { id } = await params;

  const tasks = await readDataFromFile<Task[]>(TASKS_FILE_NAME);
  const taskItem = tasks.find((task: Task) => task.id === id);

  if (!taskItem) {
    return NextResponse.json({ error: "Задача не найдена" }, { status: 404 });
  }

  const itemIndex = tasks.findIndex((task: Task) => task.id === id);
  const updatedTasks: Task[] = tasks.splice(itemIndex, 1);
  await writeDataToFile(TASKS_FILE_NAME, updatedTasks);

  return NextResponse.json({ status: 200 });
}
