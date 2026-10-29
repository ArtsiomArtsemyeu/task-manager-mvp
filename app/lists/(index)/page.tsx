import { Suspense } from 'react';
import { getTaskLists } from '@/src/entities/task-list/api';
import { TaskListsSkeleton, TaskListsWidget } from '@/src/widgets/task-lists';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Списки задач | Менеджер задач',
  description: 'Просмотр и управление списками задач',
};

export default function TasksPage() {
  const taskListsPromise = getTaskLists();

  return (
    <Suspense fallback={<TaskListsSkeleton />}>
      <TaskListsWidget taskListsPromise={taskListsPromise} />
    </Suspense>
  );
}
