import { NextResponse } from "next/server";
import { UserSession } from "@/src/entities/user";
import { defaultUser } from "@/src/shared/config";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Заполните все требуемые поля" },
        { status: 400 },
      );
    }

    if (password !== defaultUser.password) {
      return NextResponse.json(
        { error: "Неверный email или пароль" },
        { status: 401 },
      );
    }

    const userSessionPayload: UserSession = {
      userId: defaultUser.id,
      email: defaultUser.email,
    };

    return NextResponse.json({ userSessionPayload }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
