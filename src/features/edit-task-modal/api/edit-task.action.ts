"use server";

import { revalidatePath } from "next/cache";
import { apiUrl, errorMessages } from "@/src/shared/config";

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
    typeof id !== "string" ||
    typeof taskListId !== "string" ||
    typeof name !== "string" ||
    typeof description !== "string" ||
    typeof state !== "string" ||
    typeof dueDate !== "string" ||
    !id ||
    !taskListId ||
    !name.trim() ||
    !state ||
    Number.isNaN(priority) ||
    !dueDate
  ) {
    return { error: errorMessages.validation.fillAllFields };
  }

  const response = await fetch(apiUrl(`/api/data/tasks/${id}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: name.trim(),
      description: description.trim(),
      state,
      priority,
      dueDate: new Date(dueDate).toISOString(),
    }),
  });

  if (!response.ok) {
    return { error: errorMessages.error.updateTaskFailed };
  }

  revalidatePath(`/tasks/${id}`);
  revalidatePath(`/lists/${taskListId}`);
  revalidatePath("/lists");
  return { success: true };
}
