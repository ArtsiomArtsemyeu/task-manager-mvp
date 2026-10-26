import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getTask } from '@/src/entities/task/api';
import { HttpError } from '@/src/shared/lib/http-error';
import {
  TaskDetailsSkeleton,
  TaskDetailsWidget,
} from '@/src/widgets/task-details';

type TaskPageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({
  params,
}: TaskPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return {
    title: t('metadata.taskTitle'),
    description: t('metadata.taskDescription'),
  };
}

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
