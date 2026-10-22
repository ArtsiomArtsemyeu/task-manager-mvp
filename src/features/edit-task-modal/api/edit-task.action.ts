"use server";

import { revalidatePath } from "next/cache";

export type EditTaskActionState = {
  error?: string;
  success?: boolean;
} | null;

export async function editTaskAction(
  _prevState: EditTaskActionState,
  formData: FormData,
): Promise<EditTaskActionState> {
  const id = formData.get("id");
  const name = formData.get("name");
  const state = formData.get("state");
  const dueDate = formData.get("dueDate");
  const taskListId = formData.get("taskListId");
  const description = formData.get("description");
  const priority = Number(formData.get("priority"));

  if (
    !id ||
    !taskListId ||
    !name ||
    !description ||
    !state ||
    Number.isNaN(priority) ||
    !dueDate
  ) {
    return { error: "Заполните все поля корректно" };
  }

  const response = await fetch(`http://localhost:3000/api/data/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: (name as string).trim(),
      description: (description as string).trim(),
      state,
      priority,
      dueDate: new Date(dueDate as string).toISOString(),
    }),
  });

  if (!response.ok) {
    return { error: "Не удалось обновить задачу" };
  }

  revalidatePath(`/lists/${taskListId}`);
  revalidatePath("/lists");
  return { success: true };
}
