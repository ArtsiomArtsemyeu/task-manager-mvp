import "server-only";

import type { TaskListDto } from "../model/task-list-dto.model";
import { apiUrl, errorMessages } from "@/src/shared/config";

export async function getTaskList(id: string): Promise<TaskListDto> {
  const response = await fetch(apiUrl(`/api/data/task-lists/${id}`), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(errorMessages.error.loadTaskListFailed);
  }

  return (await response.json()) as TaskListDto;
}
