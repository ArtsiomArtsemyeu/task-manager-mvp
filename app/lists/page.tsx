import { Suspense } from "react";
import { apiUrl } from "@/src/shared/config";
import { TaskListsSkeleton, TaskListsWidget } from "@/src/widgets/task-lists";

export default function TasksPage() {
  const tasksListsPromise = fetch(apiUrl("/api/data/task-lists"), {
    cache: "no-store",
  }).then((response) => response.json());

  return (
    <Suspense fallback={<TaskListsSkeleton />}>
      <TaskListsWidget taskListsPromise={tasksListsPromise} />
    </Suspense>
  );
}
