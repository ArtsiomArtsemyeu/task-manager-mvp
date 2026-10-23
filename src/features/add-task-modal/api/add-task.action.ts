"use server";

import { revalidatePath } from "next/cache";
import { apiUrl } from "@/src/shared/config";

export type AddTaskActionState = {
  error?: string;
  success?: boolean;
} | null;

export async function addTaskAction(
  prevState: AddTaskActionState,
  formData: FormData,
): Promise<AddTaskActionState> {
  const taskListId = formData.get("taskListId");
  const name = formData.get("name");
  const description = formData.get("description");
  const state = formData.get("state");
  const priority = Number(formData.get("priority"));
  const dueDate = formData.get("dueDate");

  if (
    !taskListId ||
    !name ||
    !description ||
    !state ||
    Number.isNaN(priority) ||
    !dueDate
  ) {
    return { error: "Заполните все поля корректно" };
  }

  const response = await fetch(apiUrl("/api/data/tasks"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      taskListId,
      name: (name as string).trim(),
      description: (description as string).trim(),
      state,
      priority,
      dueDate: new Date(dueDate as string).toISOString(),
    }),
  });

  if (!response.ok) {
    return { error: "Не удалось создать задачу" };
  }

  revalidatePath(`/lists/${taskListId}`);
  revalidatePath("/lists");
  return { success: true };
}
