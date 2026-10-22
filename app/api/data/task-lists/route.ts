import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import { Task } from "@/src/entities/task";
import { TaskList } from "@/src/entities/task-list";
import { defaultUser, taskLists, tasks } from "../stub-data";
import { TaskListDto } from "@/src/features/task-lists/model/task-list-dto.model";

export async function GET() {
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

    taskLists.push(newTaskList);
    return NextResponse.json(newTaskList, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Некорректный JSON" }, { status: 400 });
  }
}
