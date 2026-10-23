import "server-only";

import type { TaskDto } from "../model/task-dto.model";
import { apiUrl, errorMessages } from "@/src/shared/config";

export async function getTask(id: string): Promise<TaskDto> {
  const response = await fetch(apiUrl(`/api/data/tasks/${id}`), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(errorMessages.error.loadTaskFailed);
  }

  return (await response.json()) as TaskDto;
}
