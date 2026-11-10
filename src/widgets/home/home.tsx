'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import styles from './home.module.css';
import { buildHomeCoverflowStubs } from './config/home-coverflow-stubs';
import { HomeHero } from './ui/home-hero/home-hero';
import { TaskListCard } from '@/src/features/task-list-card';
import {
  TaskListsCoverflow,
  type TaskListsCoverflowItem,
} from '@/src/features/task-lists-coverflow';

export function HomeWidget() {
  const t = useTranslations();

  const items = useMemo<TaskListsCoverflowItem[]>(() => {
    const stubs = buildHomeCoverflowStubs((key) => t(`home.stubs.${key}`));

    return stubs.map((taskList) => ({
      id: taskList.id,
      label: taskList.name,
      content: (
        <TaskListCard
          taskList={taskList}
          interactive={false}
          elevateOnHover={false}
          contentSize="large"
        />
      ),
    }));
  }, [t]);

  return (
    <div className={styles.host}>
      <HomeHero aside={<TaskListsCoverflow items={items} />} />
    </div>
  );
}
