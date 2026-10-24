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
      <Skeleton width="min(100%, 22rem)" height="2rem" />

      <div className={styles.card}>
        <div className={styles.metaRow}>
          <div className={styles.metaGroup}>
            <div className={styles.field}>
              <Skeleton width="5rem" height="0.7rem" />
              <Skeleton width="5rem" height="2.45rem" />
            </div>
            <div className={styles.field}>
              <Skeleton width="4.5rem" height="0.7rem" />
              <Skeleton width="8rem" height="2.45rem" />
            </div>
          </div>
          <div className={styles.metaTrailing}>
            <div className={styles.statusField}>
              <Skeleton width="4rem" height="0.7rem" />
              <Skeleton width="100%" height="2.45rem" />
            </div>
            <div className={styles.actions}>
              <Skeleton width="2.45rem" height="2.45rem" />
              <Skeleton width="2.45rem" height="2.45rem" />
            </div>
          </div>
        </div>

        <div className={styles.field}>
          <Skeleton width="5rem" height="0.7rem" />
          <Skeleton width="100%" height="3.5rem" />
        </div>
      </div>
    </div>
  );
}
