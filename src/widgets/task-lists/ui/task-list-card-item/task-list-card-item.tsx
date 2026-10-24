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
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const openRenameModal = useCallback(() => setIsRenameOpen(true), []);
  const closeRenameModal = useCallback(() => setIsRenameOpen(false), []);
  const openDeleteModal = useCallback(() => setIsDeleteOpen(true), []);
  const closeDeleteModal = useCallback(() => setIsDeleteOpen(false), []);

  return (
    <>
      <TaskListCard
        taskList={taskList}
        onRename={openRenameModal}
        onDelete={openDeleteModal}
      />
      <RenameTaskList
        isOpen={isRenameOpen}
        taskListId={taskList.id}
        currentName={taskList.name}
        onClose={closeRenameModal}
      />
      <DeleteTaskList
        isOpen={isDeleteOpen}
        taskListId={taskList.id}
        taskListName={taskList.name}
        onClose={closeDeleteModal}
      />
    </>
  );
}
