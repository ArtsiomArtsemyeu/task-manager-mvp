'use client';

import { clsx } from 'clsx';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './card-menu.module.css';

type CardMenuProps = {
  onRename: () => void;
  onDelete: () => void;
};

export function CardMenu({ onRename, onDelete }: CardMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => setIsOpen(false), []);

  const handleRename = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      closeMenu();
      onRename();
    },
    [closeMenu, onRename],
  );

  const handleDelete = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      closeMenu();
      onDelete();
    },
    [closeMenu, onDelete],
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [closeMenu, isOpen]);

  return (
    <div className={styles.host} ref={menuRef}>
      <button
        type="button"
        className={clsx(styles.trigger, isOpen && styles.triggerActive)}
        onClick={toggleMenu}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Действия со списком"
      >
        <Image
          className={styles.triggerIcon}
          src="/images/icons/more-vertical.svg"
          alt="Меню действий"
          width={18}
          height={18}
        />
      </button>

      {isOpen ? (
        <ul className={styles.menu} role="menu">
          <li role="none">
            <button
              type="button"
              className={styles.menuItem}
              role="menuitem"
              onClick={handleRename}
            >
              Переименовать список
            </button>
          </li>
          <li role="none">
            <button
              type="button"
              className={clsx(styles.menuItem, styles.menuItemDanger)}
              role="menuitem"
              onClick={handleDelete}
            >
              Удалить
            </button>
          </li>
        </ul>
      ) : null}
    </div>
  );
}
