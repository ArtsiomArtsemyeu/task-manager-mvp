import "server-only";

import type { TaskListDto } from "../model/task-list-dto.model";
import { apiUrl, errorMessages } from "@/src/shared/config";

export async function getTaskLists(): Promise<TaskListDto[]> {
  const response = await fetch(apiUrl("/api/data/task-lists"), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(errorMessages.error.loadTaskListsFailed);
  }

  return (await response.json()) as TaskListDto[];
}
