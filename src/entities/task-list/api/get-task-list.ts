import "server-only";
import type { TaskListDto } from "../model/task-list-dto.model";

import { apiUrl } from "@/src/shared/config";

export async function getTaskList(id: string): Promise<TaskListDto | null> {
  const response = await fetch(apiUrl(`/api/data/task-lists/${id}`), {
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as TaskListDto;
}
