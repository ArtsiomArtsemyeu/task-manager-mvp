import "server-only";

import type { TaskListDto } from "../model/task-list-dto.model";
import { apiUrl } from "@/src/shared/config";

export function getTaskLists(): Promise<TaskListDto[]> {
  return fetch(apiUrl("/api/data/task-lists"), {
    cache: "no-store",
  }).then((response: Response) => {
    if (!response.ok) {
      throw response;
    }

    return response.json();
  });
}
