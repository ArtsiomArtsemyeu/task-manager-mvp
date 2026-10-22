"use client";

import { startTransition, use, useCallback, useState } from "react";
import styles from "./task-lists.module.css";
import { TaskListItem } from "@/src/features/task-list-item";
import { AddTaskListModal } from "@/src/features/add-task-list-modal";
import { TaskListDto } from "@/src/entities/task-list";

interface TaskListsProps {
  taskListsPromise: Promise<TaskListDto[]>;
}

export function TaskListsWidget({ taskListsPromise }: TaskListsProps) {
  const taskLists: TaskListDto[] = use(taskListsPromise);
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
  const [deferredQuery, setDeferredQuery] = useState<string | undefined>(
    undefined,
  );
  const [isShowAddTaskListModal, setIsShowAddTaskListModal] =
    useState<boolean>(false);

  const changeQuery = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(event.target.value);

      startTransition(() => {
        setDeferredQuery(event.target.value);
      });
    },
    [],
  );

  const showAddTaskListModal = useCallback(
    () => setIsShowAddTaskListModal(true),
    [],
  );

  const closeAddTaskListModal = useCallback(
    () => setIsShowAddTaskListModal(false),
    [],
  );

  return (
    <div className={styles.host}>
      <div className={styles.toolbar}>
        <input
          className={styles.search}
          type="search"
          placeholder="Поиск списков…"
          onChange={changeQuery}
          value={searchQuery}
          aria-label="Поиск списков"
        />
        <button
          type="button"
          className={styles.addButton}
          onClick={showAddTaskListModal}
        >
          Добавить новый список
        </button>
      </div>
      <div className={styles.list}>
        {taskLists
          .filter((taskList: TaskListDto) =>
            deferredQuery
              ? taskList.name
                  .toLowerCase()
                  .includes(deferredQuery.toLowerCase())
              : true,
          )
          .map((taskList: TaskListDto) => (
            <TaskListItem key={taskList.id} taskList={taskList} />
          ))}
      </div>
      <AddTaskListModal
        isOpen={isShowAddTaskListModal}
        onClose={closeAddTaskListModal}
      />
    </div>
  );
}
