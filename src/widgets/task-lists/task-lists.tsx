'use client';

import { startTransition, use, useCallback, useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './task-lists.module.css';
import { TaskListCardItem } from './ui/task-list-card-item/task-list-card-item';
import { AddTaskList } from '@/src/features/add-task-list';
import type { TaskListDto } from '@/src/entities/task-list';

interface TaskListsProps {
  taskListsPromise: Promise<TaskListDto[]>;
}

export function TaskListsWidget({ taskListsPromise }: TaskListsProps) {
  const t = useTranslations();
  const taskLists: TaskListDto[] = use(taskListsPromise);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [deferredQuery, setDeferredQuery] = useState<string>('');
  const [isShowAddTaskList, setIsShowAddTaskList] = useState<boolean>(false);

  const changeQuery = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(event.target.value);

      startTransition(() => setDeferredQuery(event.target.value));
    },
    [],
  );

  const showAddTaskList = useCallback(() => setIsShowAddTaskList(true), []);

  const closeAddTaskList = useCallback(() => setIsShowAddTaskList(false), []);

  const filteredTaskLists = taskLists.filter((taskList: TaskListDto) =>
    deferredQuery.trim()
      ? taskList.name.toLowerCase().includes(deferredQuery.toLowerCase())
      : true,
  );

  return (
    <div className={styles.host}>
      <div className={styles.toolbar}>
        <input
          className={styles.search}
          type="search"
          placeholder={t('taskLists.searchPlaceholder')}
          onChange={changeQuery}
          value={searchQuery}
          aria-label={t('taskLists.searchAria')}
        />
        <button
          type="button"
          className={styles.addButton}
          onClick={showAddTaskList}
        >
          {t('taskLists.addList')}
        </button>
      </div>
      {filteredTaskLists.length === 0 && deferredQuery.trim() ? (
        <p className={styles.empty} role="status">
          {t('taskLists.nothingFound')}
        </p>
      ) : (
        <div className={styles.list}>
          {filteredTaskLists.map((taskList: TaskListDto) => (
            <TaskListCardItem key={taskList.id} taskList={taskList} />
          ))}
        </div>
      )}
      <AddTaskList isOpen={isShowAddTaskList} onClose={closeAddTaskList} />
    </div>
  );
}
