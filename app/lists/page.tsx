import { TaskListsWidget } from "@/src/widgets/task-lists";
import { cookies } from "next/headers";
import { Suspense } from "react";

export default async function TasksPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  const tasksListsPromise = fetch("http://localhost:3000/api/data/task-lists", {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${sessionToken}`,
    },
  }).then((response) => response.json());

  return (
    <Suspense fallback="Loading task lists...">
      <TaskListsWidget taskListsPromise={tasksListsPromise} />
    </Suspense>
  );
}
