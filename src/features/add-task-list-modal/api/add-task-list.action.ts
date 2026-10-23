"use server";

import { revalidatePath } from "next/cache";
import { apiUrl, errorMessages } from "@/src/shared/config";

export type AddTaskListActionState = {
  error?: string;
  success?: boolean;
} | null;

export async function addTaskListAction(
  _prevState: AddTaskListActionState,
  formData: FormData,
): Promise<AddTaskListActionState> {
  const name = formData.get("name");

  const response = await fetch(apiUrl("/api/data/task-lists"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    return { error: errorMessages.validation.invalidListName };
  }

  revalidatePath("/lists");
  return { success: true };
}
