"use server";

import { revalidatePath } from "next/cache";

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

  if (!id || !taskListId) {
    return { error: "Некорректные данные задачи" };
  }

  const response = await fetch(`http://localhost:3000/api/data/tasks/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    return { error: "Не удалось удалить задачу" };
  }

  revalidatePath(`/lists/${taskListId}`);
  revalidatePath("/lists");
  return { success: true };
}
