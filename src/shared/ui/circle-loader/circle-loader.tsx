"use client";

import styles from "./circle-loader.module.css";

interface CircleLoaderProps {
  show: boolean;
  children?: React.ReactNode;
}

export function CircleLoader({ children, show }: CircleLoaderProps) {
  if (show) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.host}></div>
        {children && <div className={styles.content}>{children}</div>}
      </div>
    );
  }
  return <>{children}</>;
}
