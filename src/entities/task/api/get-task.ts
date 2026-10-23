import "server-only";
import type { TaskDto } from "../model/task-dto.model";

import { apiUrl } from "@/src/shared/config";

export async function getTask(id: string): Promise<TaskDto | null> {
  const response = await fetch(apiUrl(`/api/data/tasks/${id}`), {
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as TaskDto;
}
