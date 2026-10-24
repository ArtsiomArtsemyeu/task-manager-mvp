import { Suspense } from 'react';
import { getTaskLists } from '@/src/entities/task-list/api';
import { TaskListsSkeleton, TaskListsWidget } from '@/src/widgets/task-lists';

export default function TasksPage() {
  const taskListsPromise = getTaskLists();

  return (
    <Suspense fallback={<TaskListsSkeleton />}>
      <TaskListsWidget taskListsPromise={taskListsPromise} />
    </Suspense>
  );
}
