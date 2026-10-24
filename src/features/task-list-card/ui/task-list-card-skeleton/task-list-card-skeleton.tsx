import styles from './task-list-card-skeleton.module.css';
import { Skeleton } from '@/src/shared/ui/components/skeleton';

export function TaskListCardSkeleton() {
  return (
    <div className={styles.host} aria-hidden="true">
      <Skeleton width="70%" height="1.25rem" />
      <Skeleton width="45%" height="0.9rem" />

      <div className={styles.metrics}>
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className={styles.metricItem}>
            <Skeleton width="60%" height="0.65rem" />
            <Skeleton width="2rem" height="0.95rem" />
          </div>
        ))}
      </div>

      <Skeleton width="100%" height="0.55rem" />

      <div className={styles.indicators}>
        <Skeleton width="75%" height="1.5rem" />
        <Skeleton width="85%" height="1.5rem" />
      </div>
    </div>
  );
}
