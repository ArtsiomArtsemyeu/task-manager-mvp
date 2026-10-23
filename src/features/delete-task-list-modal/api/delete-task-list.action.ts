"use server";

import { revalidatePath } from "next/cache";
import { apiUrl } from "@/src/shared/config";

export type DeleteTaskListActionState = {
  error?: string;
  success?: boolean;
} | null;

export async function deleteTaskListAction(
  prevState: DeleteTaskListActionState,
  formData: FormData,
): Promise<DeleteTaskListActionState> {
  const id = formData.get("id");

  if (typeof id !== "string" || !id) {
    return { error: "Некорректный идентификатор списка" };
  }

  const response = await fetch(apiUrl(`/api/data/task-lists/${id}`), {
    method: "DELETE",
  });

  if (!response.ok) {
    return { error: "Не удалось удалить список" };
  }

  revalidatePath("/lists");
  return { success: true };
}
