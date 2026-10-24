import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getTask } from '@/src/entities/task/api';
import { HttpError } from '@/src/shared/lib/http-error';
import {
  TaskDetailsSkeleton,
  TaskDetailsWidget,
} from '@/src/widgets/task-details';

type TaskPageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: 'Задача | Менеджер задач',
  description: 'Просмотр и управление задачей',
};

export default async function TaskPage({ params }: TaskPageProps) {
  const { id } = await params;
  const taskPromise = getTask(id).catch((error: unknown) => {
    if (error instanceof HttpError && error.status === 404) {
      notFound();
    }

    throw error;
  });

  return (
    <Suspense fallback={<TaskDetailsSkeleton />}>
      <TaskDetailsWidget taskPromise={taskPromise} />
    </Suspense>
  );
}
