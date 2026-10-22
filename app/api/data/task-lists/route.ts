import { v4 as uuidv4 } from "uuid";
import { Task } from "@/src/entities/task";
import { NextResponse } from "next/server";
import { defaultUser } from "../stub-data";
import { TaskList } from "@/src/entities/task-list";
import { TaskListDto } from "@/src/widgets/task-lists/model/task-list-dto.model";
import { readDataFromFile, writeDataToFile } from "@/src/data/utils/file.util";

const TASKS_FILE_NAME = "tasks.json";
const TASK_LISTS_FILE_NAME = "task-lists.json";

export async function GET() {
  const taskLists = await readDataFromFile<TaskList[]>(TASK_LISTS_FILE_NAME);
  const tasks = await readDataFromFile<Task[]>(TASKS_FILE_NAME);

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
    const body = await request.json();

    const newTaskList: TaskList = {
      id: uuidv4(),
      name: body.name,
      userId: defaultUser.id,
      taskIds: body.taskIds || [],
    };

    const taskLists = await readDataFromFile<TaskList[]>(TASK_LISTS_FILE_NAME);
    taskLists.push(newTaskList);

    await writeDataToFile(TASK_LISTS_FILE_NAME, taskLists);

    return NextResponse.json(newTaskList, { status: 201 });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: "Некорректный JSON" }, { status: 400 });
  }
}
