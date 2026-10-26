import { clsx } from 'clsx';
import Image from 'next/image';
import { forwardRef } from 'react';
import type { SelectHTMLAttributes } from 'react';
import styles from './select.module.css';

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> & {
  size?: 'sm' | 'md';
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ className, size = 'md', children, ...props }, ref) {
    return (
      <div className={clsx(styles.host, size === 'sm' && styles.sm, className)}>
        <select ref={ref} className={styles.select} {...props}>
          {children}
        </select>
        <span className={styles.chevron} aria-hidden>
          <Image
            className={styles.chevronIcon}
            src="/images/icons/chevron-down.svg"
            alt="Открыть список"
            width={16}
            height={16}
          />
        </span>
      </div>
    );
  },
);
