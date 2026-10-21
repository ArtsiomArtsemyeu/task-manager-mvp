"use client";

import { TaskList } from "@/src/entities/task-list";
import Link from "next/link";
import styles from "./task-list-item.module.css";

interface TaskListItemProps {
  taskList: TaskList;
}

export function TaskListItem({ taskList }: TaskListItemProps) {
  return (
    <Link href={`/lists/${taskList.id}`} className={styles.link}>
      <div className={styles.host}>
        <div className={styles.body}>
          <p className={styles.name}>{taskList.name}</p>
        </div>
      </div>
    </Link>
  );
}
