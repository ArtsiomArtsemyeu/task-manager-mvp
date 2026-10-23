import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTaskList } from "@/src/entities/task-list/api";
import {
  TaskListDetailsSkeleton,
  TaskListDetailsWidget,
} from "@/src/widgets/task-list-details";

type TaskListPageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Список задач | Менеджер задач",
  description: "Просмотр и управление задачами выбранного списка",
};

async function TaskListContent({ id }: { id: string }) {
  const taskList = await getTaskList(id);

  if (!taskList) {
    notFound();
  }

  return <TaskListDetailsWidget taskList={taskList} />;
}

export default async function TaskListPage({ params }: TaskListPageProps) {
  const { id } = await params;

  return (
    <Suspense fallback={<TaskListDetailsSkeleton />}>
      <TaskListContent id={id} />
    </Suspense>
  );
}
