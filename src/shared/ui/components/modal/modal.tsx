'use client';

import Image from 'next/image';
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './modal.module.css';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
};

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  action,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.overlay}>
      <div className={styles.content} role="dialog" aria-modal="true">
        <header className={styles.header}>
          <h2>{title}</h2>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Закрыть"
          >
            <Image
              src="/images/icons/close.svg"
              alt="Закрыть"
              width={20}
              height={20}
            />
          </button>
        </header>
        <div className={styles.body}>{children}</div>
        {action != null && (
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              Отмена
            </button>
            {action}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
