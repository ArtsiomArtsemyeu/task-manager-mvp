'use client';

import { clsx } from 'clsx';
import styles from './circle-loader.module.css';

interface CircleLoaderProps {
  show: boolean;
  children?: React.ReactNode;
}

export function CircleLoader({ children, show }: CircleLoaderProps) {
  return (
    <div className={styles.wrapper}>
      {show ? (
        <div className={styles.spinnerSlot} aria-hidden>
          <div className={styles.host} />
        </div>
      ) : null}
      <div className={clsx(show && styles.content)}>{children}</div>
    </div>
  );
}
