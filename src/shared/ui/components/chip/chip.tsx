import { clsx } from 'clsx';
import styles from './chip.module.css';

type ChipProps = {
  label: string;
  color: 'red' | 'yellow';
};

export function Chip({ label, color }: ChipProps) {
  return (
    <div
      className={clsx(
        styles.host,
        color === 'red' && styles.red,
        color === 'yellow' && styles.yellow,
      )}
    >
      {label}
    </div>
  );
}
