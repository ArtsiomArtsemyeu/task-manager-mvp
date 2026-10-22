import type { Task } from "@/src/entities/task/@x/task-list";

export interface TaskListDto {
  id: string;
  name: string;
  userId: string;
  tasks: Task[];
}
