'use client';

import { clsx } from 'clsx';
import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import styles from './input.module.css';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  suffix?: ReactNode;
};

function ErrorIcon() {
  return (
    <svg
      className={styles.errorIcon}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={18}
      height={18}
      fill="none"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 8v5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="16.5" r="1" fill="currentColor" />
    </svg>
  );
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, error, suffix, ...props },
  ref,
) {
  const errorId = useId();
  const hasError = Boolean(error);
  const hasSuffix = Boolean(suffix);

  return (
    <div
      className={clsx(
        styles.host,
        hasError && styles.hasError,
        hasSuffix && styles.hasSuffix,
        className,
      )}
    >
      <input
        ref={ref}
        className={styles.input}
        aria-invalid={hasError || undefined}
        aria-describedby={hasError ? errorId : undefined}
        {...props}
      />
      {hasError || hasSuffix ? (
        <div className={styles.end}>
          {hasError ? (
            <span className={styles.errorTrigger} tabIndex={0}>
              <ErrorIcon />
              <span id={errorId} role="tooltip" className={styles.tooltip}>
                {error}
              </span>
            </span>
          ) : null}
          {hasSuffix ? <div className={styles.suffix}>{suffix}</div> : null}
        </div>
      ) : null}
    </div>
  );
});
