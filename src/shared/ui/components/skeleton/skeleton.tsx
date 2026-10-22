import { clsx } from "clsx";
import styles from "./skeleton.module.css";

type SkeletonProps = {
  width?: string | number;
  height?: string | number;
  className?: string;
  circle?: boolean;
};

function toCssSize(value?: string | number): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  return typeof value === "number" ? `${value}px` : value;
}

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
