import "server-only";

import type { TaskListDto } from "../model/task-list-dto.model";
import { apiUrl } from "@/src/shared/config";

export function getTaskList(id: string): Promise<TaskListDto> {
  return fetch(apiUrl(`/api/data/task-lists/${id}`), {
    cache: "no-store",
  }).then((response: Response) => {
    if (!response.ok) {
      throw response;
    }

    return response.json();
  });
}
