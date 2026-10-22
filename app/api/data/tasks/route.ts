import { v4 as uuidv4 } from "uuid";
import { Task } from "@/src/entities/task";
import { NextResponse } from "next/server";
import { TaskList } from "@/src/entities/task-list";
import { readDataFromFile, writeDataToFile } from "@/src/data/utils/file.util";

const TASKS_FILE_NAME = "tasks.json";
const TASK_LISTS_FILE_NAME = "task-lists.json";

export async function GET() {
  const tasks = await readDataFromFile<Task[]>(TASKS_FILE_NAME);
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

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

    return NextResponse.json({ error: "Некорректный JSON" }, { status: 400 });
  }
}
