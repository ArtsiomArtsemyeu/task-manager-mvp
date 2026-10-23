"use client";

import { useCallback, useState } from "react";
import { TaskListCard } from "@/src/features/task-list-card";
import { RenameTaskListModal } from "@/src/features/rename-task-list-modal";
import { DeleteTaskListModal } from "@/src/features/delete-task-list-modal";
import type { TaskListDto } from "@/src/entities/task-list";

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
      <RenameTaskListModal
        isOpen={isRenameOpen}
        taskListId={taskList.id}
        currentName={taskList.name}
        onClose={closeRenameModal}
      />
      <DeleteTaskListModal
        isOpen={isDeleteOpen}
        taskListId={taskList.id}
        taskListName={taskList.name}
        onClose={closeDeleteModal}
      />
    </>
  );
}
