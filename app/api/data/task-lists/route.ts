import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import { TaskList } from "@/src/entities/task-list";
import { defaultUser, taskLists } from "../stub-data";

export async function GET() {
  return NextResponse.json(taskLists);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newList: TaskList = {
      id: uuidv4(),
      name: body.name,
      userId: defaultUser.id,
      taskIds: body.taskIds || [],
    };

    taskLists.push(newList);
    return NextResponse.json(newList, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Некорректный JSON" }, { status: 400 });
  }
}
