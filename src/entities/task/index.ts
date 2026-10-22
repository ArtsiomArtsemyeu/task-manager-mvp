export type { Task } from "./model/task.model";
export {
  calculateTaskCountByState,
  calculateTaskListProgress,
  isDeadlineWithin48Hours,
} from "./utils/task.util";
