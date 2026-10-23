"use server";

import { revalidatePath } from "next/cache";
import { apiUrl, errorMessages } from "@/src/shared/config";

export type AddTaskActionState = {
  error?: string;
  success?: boolean;
} | null;

export async function addTaskAction(
  _prevState: AddTaskActionState,
  formData: FormData,
): Promise<AddTaskActionState> {
  const taskListId = formData.get("taskListId");
  const name = formData.get("name");
  const description = formData.get("description");
  const state = formData.get("state");
  const priority = Number(formData.get("priority"));
  const dueDate = formData.get("dueDate");

  if (
    typeof taskListId !== "string" ||
    typeof name !== "string" ||
    typeof description !== "string" ||
    typeof state !== "string" ||
    typeof dueDate !== "string" ||
    !taskListId ||
    !name ||
    !description ||
    !state ||
    Number.isNaN(priority) ||
    !dueDate
  ) {
    return { error: errorMessages.validation.fillAllFields };
  }

  const response = await fetch(apiUrl("/api/data/tasks"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      taskListId,
      name: name.trim(),
      description: description.trim(),
      state,
      priority,
      dueDate: new Date(dueDate).toISOString(),
    }),
  });

  if (!response.ok) {
    return { error: errorMessages.error.createTaskFailed };
  }

  revalidatePath(`/lists/${taskListId}`);
  revalidatePath("/lists");
  return { success: true };
}
