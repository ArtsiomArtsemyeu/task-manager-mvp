import styles from './task-details-skeleton.module.css';
import { Skeleton } from '@/src/shared/ui/components/skeleton';

export function TaskDetailsSkeleton() {
  return (
    <div
      className={styles.host}
      role="status"
      aria-busy="true"
      aria-label="Загрузка задачи"
    >
      <Skeleton width="8.5rem" height="2.65rem" />

      <div className={styles.topRow}>
        <Skeleton width="min(100%, 22rem)" height="2rem" />
        <div className={styles.actions}>
          <Skeleton width="2.45rem" height="2.45rem" />
          <Skeleton width="2.45rem" height="2.45rem" />
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.field}>
          <Skeleton width="5rem" height="0.7rem" />
          <Skeleton width="100%" height="3.5rem" />
        </div>

        <div className={styles.metaRow}>
          <div className={styles.field}>
            <Skeleton width="4rem" height="0.7rem" />
            <Skeleton width="100%" height="2.4rem" />
          </div>
          <div className={styles.field}>
            <Skeleton width="5rem" height="0.7rem" />
            <Skeleton width="5rem" height="1.7rem" />
          </div>
          <div className={styles.field}>
            <Skeleton width="4.5rem" height="0.7rem" />
            <Skeleton width="8rem" height="1rem" />
          </div>
        </div>
      </div>
    </div>
  );
}
