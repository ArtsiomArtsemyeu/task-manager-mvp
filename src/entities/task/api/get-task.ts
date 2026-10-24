import "server-only";

import type { TaskDto } from "../model/task-dto.model";
import { apiUrl } from "@/src/shared/config";

export function getTask(id: string): Promise<TaskDto> {
  return fetch(apiUrl(`/api/data/tasks/${id}`), {
    cache: "no-store",
  }).then((response: Response) => {
    if (!response.ok) {
      throw response;
    }

    return response.json();
  });
}
