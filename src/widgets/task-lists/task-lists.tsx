"use client";

import { TaskList } from "@/src/entities/task-list";
import { TaskListItem } from "@/src/features/task-list-item";
import { use } from "react";
import styles from './task-lists.module.css';

interface TaskListsProps {
  taskListsPromise: Promise<TaskList[]>;
}

export function TaskListsWidget({ taskListsPromise }: TaskListsProps) {
  const taskLists: TaskList[] = use(taskListsPromise);

  return (
    <div className={styles.host}>
      {taskLists.map((taskList) => (
        <TaskListItem key={taskList.id} taskList={taskList} />
      ))}
    </div>
  );
}
