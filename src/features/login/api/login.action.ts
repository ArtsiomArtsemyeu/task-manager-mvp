"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type LoginActionState = {
  error?: string;
  success?: boolean;
} | null;
export async function loginAction(
  prevState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const email = formData.get("email");
  const password = formData.get("password");

  const response = await fetch("http:/localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    return { error: "Неверный email или пароль" };
  }

  const { user } = await response.json();

  const cookieStore = await cookies();
  cookieStore.set("session_token", JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/lists");
}
