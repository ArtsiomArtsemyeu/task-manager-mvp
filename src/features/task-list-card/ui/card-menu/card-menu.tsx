'use client';

import { clsx } from 'clsx';
import Image from 'next/image';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './card-menu.module.css';

type CardMenuProps = {
  onRenameTasksListName: () => void;
  onDeleteTasksList: () => void;
};

export function CardMenu({
  onRenameTasksListName,
  onDeleteTasksList,
}: CardMenuProps) {
  const t = useTranslations();
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleMenu = useCallback(
    () => setIsOpen((prev: boolean) => !prev),
    [],
  );

  const closeMenu = useCallback(() => setIsOpen(false), []);

  const handleRenameTasksListName = useCallback(() => {
    closeMenu();
    onRenameTasksListName();
  }, [closeMenu, onRenameTasksListName]);

  const handleDeleteTasksList = useCallback(() => {
    closeMenu();
    onDeleteTasksList();
  }, [closeMenu, onDeleteTasksList]);

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
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-label={t('taskListCard.menuAria')}
      >
        <Image
          className={styles.triggerIcon}
          src="/images/icons/more-vertical.svg"
          alt={t('taskListCard.menuAlt')}
          width={18}
          height={18}
        />
      </button>

      {isOpen ? (
        <ul id={menuId} className={styles.menu}>
          <li>
            <button
              type="button"
              className={styles.menuItem}
              onClick={handleRenameTasksListName}
            >
              {t('taskListCard.rename')}
            </button>
          </li>
          <li>
            <button
              type="button"
              className={clsx(styles.menuItem, styles.menuItemDanger)}
              onClick={handleDeleteTasksList}
            >
              {t('common.delete')}
            </button>
          </li>
        </ul>
      ) : null}
    </div>
  );
}
