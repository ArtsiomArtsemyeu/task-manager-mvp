import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import { getTaskLists } from '@/src/entities/task-list/api';
import { assertLocale } from '@/src/shared/i18n';
import { TaskListsSkeleton, TaskListsWidget } from '@/src/widgets/task-lists';

type ListsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: ListsPageProps): Promise<Metadata> {
  const locale = assertLocale((await params).locale);
  const t = await getTranslations({ locale });

  return {
    title: t('metadata.listsTitle'),
    description: t('metadata.listsDescription'),
  };
}

export default async function TasksPage({ params }: ListsPageProps) {
  assertLocale((await params).locale);
  const taskListsPromise = getTaskLists();

  return (
    <Suspense fallback={<TaskListsSkeleton />}>
      <TaskListsWidget taskListsPromise={taskListsPromise} />
    </Suspense>
  );
}
