import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { User, UserSession } from "@/app/src/entities/user";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Заполните все требуемые поля" },
        { status: 400 },
      );
    }

    const user: User = {
      id: "055cf2ac-a56a-4d16-a897-4597c4ea3756",
      email: "admin@example.com",
      password: "Admin123!",
    };

    if (!user) {
      return NextResponse.json(
        { error: "Неверный email или пароль" },
        { status: 401 },
      );
    }

    if (password !== user.password) {
      return NextResponse.json(
        { error: "Неверный email или пароль" },
        { status: 401 },
      );
    }

    const sessionPayload: UserSession = {
      userId: user.id,
      email: user.email,
    };

    const cookieStore = await cookies();
    cookieStore.set("session", JSON.stringify(sessionPayload));

    return NextResponse.json({ success: true, user: sessionPayload });
  } catch (error) {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
