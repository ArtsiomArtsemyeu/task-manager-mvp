import { Task } from "@/src/entities/task";

export interface TaskListDto {
  id: string;
  name: string;
  userId: string;
  tasks: Task[];
}
