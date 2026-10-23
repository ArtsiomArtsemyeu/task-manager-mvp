import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
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

async function TaskContent({ id }: { id: string }) {
  const task = await getTask(id);

  if (!task) {
    notFound();
  }

  return <TaskDetailsWidget task={task} />;
}

export default async function TaskPage({ params }: TaskPageProps) {
  const { id } = await params;

  return (
    <Suspense fallback={<TaskDetailsSkeleton />}>
      <TaskContent id={id} />
    </Suspense>
  );
}
