import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import { getTaskLists } from '@/src/entities/task-list/api';
import { TaskListsSkeleton, TaskListsWidget } from '@/src/widgets/task-lists';

type TasksPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: TasksPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return {
    title: t('metadata.listsTitle'),
    description: t('metadata.listsDescription'),
  };
}

export default function TasksPage() {
  const taskListsPromise = getTaskLists();

  return (
    <Suspense fallback={<TaskListsSkeleton />}>
      <TaskListsWidget taskListsPromise={taskListsPromise} />
    </Suspense>
  );
}
