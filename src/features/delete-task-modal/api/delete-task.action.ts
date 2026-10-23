"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { apiUrl } from "@/src/shared/config";

export type DeleteTaskActionState = {
  error?: string;
  success?: boolean;
} | null;

export async function deleteTaskAction(
  prevState: DeleteTaskActionState,
  formData: FormData,
): Promise<DeleteTaskActionState> {
  const id = formData.get("id");
  const taskListId = formData.get("taskListId");
  const redirectTo = formData.get("redirectTo");

  if (!id || !taskListId) {
    return { error: "Некорректные данные задачи" };
  }

  const response = await fetch(apiUrl(`/api/data/tasks/${id}`), {
    method: "DELETE",
  });

  if (!response.ok) {
    return { error: "Не удалось удалить задачу" };
  }

  revalidatePath(`/tasks/${id}`);
  revalidatePath(`/lists/${taskListId}`);
  revalidatePath("/lists");

  if (typeof redirectTo === "string" && redirectTo.startsWith("/")) {
    redirect(redirectTo);
  }

  return { success: true };
}
