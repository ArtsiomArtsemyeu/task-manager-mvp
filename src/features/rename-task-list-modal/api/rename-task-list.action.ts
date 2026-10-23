"use server";

import { revalidatePath } from "next/cache";
import { apiUrl, errorMessages } from "@/src/shared/config";

export type RenameTaskListActionState = {
  error?: string;
  success?: boolean;
} | null;

export async function renameTaskListAction(
  _prevState: RenameTaskListActionState,
  formData: FormData,
): Promise<RenameTaskListActionState> {
  const id = formData.get("id");
  const name = formData.get("name");

  if (typeof id !== "string" || !id) {
    return { error: errorMessages.validation.invalidTaskListId };
  }

  if (typeof name !== "string" || !name.trim()) {
    return { error: errorMessages.validation.nameRequired };
  }

  const response = await fetch(apiUrl(`/api/data/task-lists/${id}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: name.trim() }),
  });

  if (!response.ok) {
    return { error: errorMessages.error.renameTaskListFailed };
  }

  revalidatePath("/lists");
  return { success: true };
}
