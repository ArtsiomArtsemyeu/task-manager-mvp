import styles from './progress-bar.module.css';

export function ProgressBar({ progress = 0 }) {
  const validatedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={styles.host}>
      <div
        className={styles.bar}
        style={{ width: `${validatedProgress}%` }}
      ></div>
    </div>
  );
}
