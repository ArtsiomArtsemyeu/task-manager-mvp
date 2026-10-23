import { v4 as uuidv4 } from "uuid";
import { isTaskState } from "@/src/entities/task";
import type { Task } from "@/src/entities/task";
import { NextResponse } from "next/server";
import type { TaskList } from "@/src/entities/task-list";
import { errorMessages } from "@/src/shared/config";
import { readDataFromFile, writeDataToFile } from "@/src/shared/lib/file-storage";
import { isRecord, readJson } from "@/src/shared/utils/type-guard";

const TASKS_FILE_NAME = "tasks.json";
const TASK_LISTS_FILE_NAME = "task-lists.json";

export async function GET() {
  const tasks = await readDataFromFile<Task[]>(TASKS_FILE_NAME);
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  try {
    const body = await readJson(request);

    if (
      !isRecord(body) ||
      typeof body.name !== "string" ||
      typeof body.description !== "string" ||
      typeof body.state !== "string" ||
      !isTaskState(body.state) ||
      typeof body.priority !== "number" ||
      typeof body.dueDate !== "string" ||
      typeof body.taskListId !== "string"
    ) {
      return NextResponse.json({ error: errorMessages.validation.invalidJson }, { status: 400 });
    }

    const generatedId = uuidv4();
    const newTask: Task = {
      id: generatedId,
      name: body.name,
      description: body.description,
      state: body.state,
      priority: body.priority,
      dueDate: body.dueDate,
    };

    const tasks = await readDataFromFile<Task[]>(TASKS_FILE_NAME);
    tasks.push(newTask);
    await writeDataToFile(TASKS_FILE_NAME, tasks);

    const taskLists = await readDataFromFile<TaskList[]>(TASK_LISTS_FILE_NAME);
    const updatedtaskListId = body.taskListId;
    const updatedTaskList: TaskList[] = taskLists.map((taskList: TaskList) =>
      taskList.id === updatedtaskListId
        ? { ...taskList, taskIds: [...taskList.taskIds, generatedId] }
        : taskList,
    );
    await writeDataToFile(TASK_LISTS_FILE_NAME, updatedTaskList);

    return NextResponse.json({ status: 201 });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: errorMessages.validation.invalidJson }, { status: 400 });
  }
}
