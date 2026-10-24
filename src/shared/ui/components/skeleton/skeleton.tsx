import { clsx } from 'clsx';
import styles from './skeleton.module.css';
import { toCssSize } from '@/src/shared/utils/css';

type SkeletonProps = {
  width?: string | number;
  height?: string | number;
  className?: string;
  circle?: boolean;
};

export function Skeleton({
  width,
  height,
  className,
  circle = false,
}: SkeletonProps) {
  return (
    <span
      className={clsx(styles.bone, circle && styles.circle, className)}
      style={{ width: toCssSize(width), height: toCssSize(height) }}
      aria-hidden="true"
    />
  );
}
