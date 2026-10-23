"use server";

import { revalidatePath } from "next/cache";
import { apiUrl } from "@/src/shared/config";

export async function changeTaskStatusAction(
  id: string,
  taskListId: string,
  state: string,
): Promise<{ error?: string; success?: boolean }> {
  if (!id || !taskListId || !state) {
    return { error: "Некорректные данные статуса" };
  }

  const response = await fetch(apiUrl(`/api/data/tasks/${id}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ state }),
  });

  if (!response.ok) {
    return { error: "Не удалось изменить статус" };
  }

  revalidatePath(`/tasks/${id}`);
  revalidatePath(`/lists/${taskListId}`);
  revalidatePath("/lists");
  return { success: true };
}
