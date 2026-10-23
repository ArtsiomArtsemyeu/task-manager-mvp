import type { Metadata } from "next";
import { Suspense } from "react";
import { getTask } from "@/src/entities/task/api";
import {
  TaskDetailsSkeleton,
  TaskDetailsWidget,
} from "@/src/widgets/task-details";

type TaskPageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Задача | Менеджер задач",
  description: "Просмотр и управление задачей",
};

export default async function TaskPage({ params }: TaskPageProps) {
  const { id } = await params;
  const taskPromise = getTask(id);

  return (
    <Suspense fallback={<TaskDetailsSkeleton />}>
      <TaskDetailsWidget taskPromise={taskPromise} />
    </Suspense>
  );
}
