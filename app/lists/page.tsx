import { TaskListsWidget } from "@/src/widgets/task-lists";
import { Suspense } from "react";

export default async function TasksPage() {
  const tasksListsPromise = fetch("http://localhost:3000/api/data/task-lists", {
    cache: "no-store",
  }).then((response) => response.json());

  return (
    <Suspense fallback="Loading task lists...">
      <TaskListsWidget taskListsPromise={tasksListsPromise} />
    </Suspense>
  );
}
