import { Suspense } from "react";
import { TaskListsSkeleton, TaskListsWidget } from "@/src/widgets/task-lists";

export default async function TasksPage() {
  const tasksListsPromise = fetch("http://localhost:3000/api/data/task-lists", {
    cache: "no-store",
  }).then((response) => response.json());

  return (
    <Suspense fallback={<TaskListsSkeleton />}>
      <TaskListsWidget taskListsPromise={tasksListsPromise} />
    </Suspense>
  );
}
