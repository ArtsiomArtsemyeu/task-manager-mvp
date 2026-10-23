"use server";

import { revalidatePath } from "next/cache";
import type { TaskState } from "@/src/entities/task";
import { apiUrl, errorMessages } from "@/src/shared/config";

export async function changeTaskStatusAction(
  id: string,
  taskListId: string,
  state: TaskState,
): Promise<{ error?: string; success?: boolean }> {
  if (!id || !taskListId) {
    return { error: errorMessages.validation.invalidStatusData };
  }

  const response = await fetch(apiUrl(`/api/data/tasks/${id}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ state }),
  });

  if (!response.ok) {
    return { error: errorMessages.error.changeStatusFailed };
  }

  revalidatePath(`/tasks/${id}`);
  revalidatePath(`/lists/${taskListId}`);
  revalidatePath("/lists");
  return { success: true };
}
