"use client";

import { use } from "react";
import styles from "./task-lists.module.css";
import { TaskListDto } from "./model/task-list-dto.model";
import { TaskListItem } from "@/src/features/task-list-item";

interface TaskListsProps {
  taskListsPromise: Promise<TaskListDto[]>;
}

export function TaskListsWidget({ taskListsPromise }: TaskListsProps) {
  const taskLists: TaskListDto[] = use(taskListsPromise);

  return (
    <div className={styles.host}>
      {taskLists.map((taskList) => (
        <TaskListItem key={taskList.id} taskList={taskList} />
      ))}
    </div>
  );
}
