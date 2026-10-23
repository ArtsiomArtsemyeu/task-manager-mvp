import { NextResponse } from "next/server";
import { Task, TaskDto } from "@/src/entities/task";
import { TaskList } from "@/src/entities/task-list";
import { readDataFromFile, writeDataToFile } from "@/src/shared/lib/file-storage";

const TASKS_FILE_NAME = "tasks.json";
const TASK_LISTS_FILE_NAME = "task-lists.json";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;

  const tasks = await readDataFromFile<Task[]>(TASKS_FILE_NAME);
  const taskItem = tasks.find((task: Task) => task.id === id);

  if (!taskItem) {
    return NextResponse.json({ error: "Задача не найдена" }, { status: 404 });
  }

  const taskLists = await readDataFromFile<TaskList[]>(TASK_LISTS_FILE_NAME);
  const taskListItem = taskLists.find((taskList: TaskList) =>
    taskList.taskIds.includes(id),
  );

  if (!taskListItem) {
    return NextResponse.json(
      { error: "Список задач для задачи не найден" },
      { status: 404 },
    );
  }

  const taskDto: TaskDto = {
    ...taskItem,
    taskListId: taskListItem.id,
    taskListName: taskListItem.name,
  };

  return NextResponse.json(taskDto);
}

export async function PUT(request: Request, { params }: RouteParams) {
  const { id } = await params;

  const tasks = await readDataFromFile<Task[]>(TASKS_FILE_NAME);
  const taskItem = tasks.find((task: Task) => task.id === id);

  if (!taskItem) {
    return NextResponse.json({ error: "Задача не найдена" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const updatedTasks = tasks.map((task: Task) =>
      task.id === id
        ? {
            ...task,
            name: body.name ?? task.name,
            description: body.description ?? task.description,
            state: body.state ?? task.state,
            priority: body.priority ?? task.priority,
            dueDate: body.dueDate ?? task.dueDate,
          }
        : task,
    );

    await writeDataToFile(TASKS_FILE_NAME, updatedTasks);

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Некорректный JSON" }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id } = await params;

  const tasks = await readDataFromFile<Task[]>(TASKS_FILE_NAME);
  const taskItem = tasks.find((task: Task) => task.id === id);

  if (!taskItem) {
    return NextResponse.json({ error: "Задача не найдена" }, { status: 404 });
  }

  const updatedTasks = tasks.filter((task: Task) => task.id !== id);
  await writeDataToFile(TASKS_FILE_NAME, updatedTasks);

  const taskLists = await readDataFromFile<TaskList[]>(TASK_LISTS_FILE_NAME);
  const updatedTaskLists = taskLists.map((taskList: TaskList) => ({
    ...taskList,
    taskIds: taskList.taskIds.filter((taskId: string) => taskId !== id),
  }));
  await writeDataToFile(TASK_LISTS_FILE_NAME, updatedTaskLists);

  return NextResponse.json({ status: 200 });
}
