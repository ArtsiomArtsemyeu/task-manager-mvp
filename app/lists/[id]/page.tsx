import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getTaskList } from '@/src/entities/task-list/api';
import { HttpError } from '@/src/shared/lib/http-error';
import {
  TaskListDetailsSkeleton,
  TaskListDetailsWidget,
} from '@/src/widgets/task-list-details';

type TaskListPageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: 'Список задач | Менеджер задач',
  description: 'Просмотр и управление задачами выбранного списка',
};

export default async function TaskListPage({ params }: TaskListPageProps) {
  const { id } = await params;
  const taskListPromise = getTaskList(id).catch((error: unknown) => {
    if (error instanceof HttpError && error.status === 404) {
      notFound();
    }

    throw error;
  });

  return (
    <Suspense fallback={<TaskListDetailsSkeleton />}>
      <TaskListDetailsWidget taskListPromise={taskListPromise} />
    </Suspense>
  );
}
