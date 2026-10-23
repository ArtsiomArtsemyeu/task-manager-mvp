"use server";

import { revalidatePath } from "next/cache";
import { apiUrl } from "@/src/shared/config";

export type RenameTaskListActionState = {
  error?: string;
  success?: boolean;
} | null;

export async function renameTaskListAction(
  prevState: RenameTaskListActionState,
  formData: FormData,
): Promise<RenameTaskListActionState> {
  const id = formData.get("id");
  const name = formData.get("name");

  if (typeof id !== "string" || !id) {
    return { error: "Некорректный идентификатор списка" };
  }

  if (typeof name !== "string" || !name.trim()) {
    return { error: "Имя обязательно" };
  }

  const response = await fetch(apiUrl(`/api/data/task-lists/${id}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: name.trim() }),
  });

  if (!response.ok) {
    return { error: "Не удалось переименовать список" };
  }

  revalidatePath("/lists");
  return { success: true };
}
