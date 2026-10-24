'use client';

import { useCallback, useState } from 'react';
import { TaskListCard } from '@/src/features/task-list-card';
import { RenameTaskList } from '@/src/features/rename-task-list';
import { DeleteTaskList } from '@/src/features/delete-task-list';
import type { TaskListDto } from '@/src/entities/task-list';

type TaskListCardItemProps = {
  taskList: TaskListDto;
};

export function TaskListCardItem({ taskList }: TaskListCardItemProps) {
  const [isRenameOpen, setIsRenameOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);

  const openRenameTasksListNameModal = useCallback(
    () => setIsRenameOpen(true),
    [],
  );
  const closeRenameTasksListNameModal = useCallback(
    () => setIsRenameOpen(false),
    [],
  );
  const openDeleteTasksListModal = useCallback(() => setIsDeleteOpen(true), []);
  const closeDeleteTasksListModal = useCallback(
    () => setIsDeleteOpen(false),
    [],
  );

  return (
    <>
      <TaskListCard
        taskList={taskList}
        onRename={openRenameTasksListNameModal}
        onDelete={openDeleteTasksListModal}
      />
      <RenameTaskList
        isOpen={isRenameOpen}
        taskListId={taskList.id}
        currentName={taskList.name}
        onClose={closeRenameTasksListNameModal}
      />
      <DeleteTaskList
        isOpen={isDeleteOpen}
        taskListId={taskList.id}
        taskListName={taskList.name}
        onClose={closeDeleteTasksListModal}
      />
    </>
  );
}
