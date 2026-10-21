import { NextRequest, NextResponse } from "next/server";
import { taskLists } from "../data";
import { TaskList } from "@/src/entities/task-list";
import { v4 as uuidv4 } from "uuid";
import { verifyToken } from "@/src/shared/utils/jwt";
import { UserSession } from "@/src/entities/user";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader) {
    return NextResponse.json(
      { error: "Пользователь не авторизован" },
      { status: 401 },
    );
  }

  const sessionToken = authHeader.split(" ")[1];

  const userSessionInfo = verifyToken<UserSession>(sessionToken);

  const userId = userSessionInfo?.userId;
  if (userId) {
    const userTaskLists = taskLists.filter(
      (taskList: TaskList) => taskList.userId === userId,
    );

    return NextResponse.json(userTaskLists);
  }

  return NextResponse.json([]);
}

export async function POST(request: Request) {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader) {
    return NextResponse.json(
      { error: "Пользователь не авторизован" },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();

    const sessionToken = authHeader.split(" ")[1];
    const sessionInfo = verifyToken<UserSession>(sessionToken);
    const userId = sessionInfo?.userId;

    const newList: TaskList = {
      id: uuidv4(),
      name: body.name,
      userId: userId!,
      taskIds: body.taskIds || [],
    };

    taskLists.push(newList);
    return NextResponse.json(newList, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Некорректный JSON" }, { status: 400 });
  }
}
