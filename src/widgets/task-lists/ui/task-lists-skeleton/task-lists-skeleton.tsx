import styles from './task-lists-skeleton.module.css';
import { TaskListCardSkeleton } from '@/src/features/task-list-card';
import { Skeleton } from '@/src/shared/ui/components/skeleton';

const CARD_PLACEHOLDERS = 6;

export function TaskListsSkeleton() {
  return (
    <div
      className={styles.host}
      role="status"
      aria-busy="true"
      aria-label="Загрузка списков задач"
    >
      <div className={styles.toolbar}>
        <Skeleton width="min(100%, 28rem)" height="2.75rem" />
        <Skeleton width="11rem" height="2.75rem" />
      </div>

      <div className={styles.list}>
        {Array.from({ length: CARD_PLACEHOLDERS }).map((_: unknown, index: number) => (
          <TaskListCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
