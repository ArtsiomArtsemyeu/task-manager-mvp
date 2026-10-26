'use client';

import { startTransition, useActionState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import type { DeleteTaskListActionState } from './api/delete-task-list.action';
import { deleteTaskListAction } from './api/delete-task-list.action';
import styles from './delete-task-list.module.css';
import { Modal } from '@/src/shared/ui/components/modal';
import { ErrorHighlight } from '@/src/shared/ui/components/error-highlight';

type DeleteTaskListProps = {
  isOpen: boolean;
  taskListId: string;
  taskListName: string;
  onClose: () => void;
};

export function DeleteTaskList({
  isOpen,
  taskListId,
  taskListName,
  onClose,
}: DeleteTaskListProps) {
  const t = useTranslations();
  const [state, formAction, isPending] = useActionState<
    DeleteTaskListActionState,
    FormData
  >(deleteTaskListAction, null);

  useEffect(() => {
    if (state?.success) {
      onClose();
    }
  }, [state, onClose]);

  const onConfirm = () => {
    startTransition(() => {
      const formData = new FormData();
      Object.entries({ id: taskListId }).forEach(
        ([key, val]: [string, string]) => formData.append(key, val),
      );
      formAction(formData);
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      title={t('deleteTaskList.title')}
      onClose={onClose}
      action={
        <button
          type="button"
          className={styles.btnDanger}
          onClick={onConfirm}
          disabled={isPending}
        >
          {isPending ? t('common.deleting') : t('common.delete')}
        </button>
      }
    >
      <div className={styles.message}>
        <p className={styles.messageText}>
          {t('deleteTaskList.confirm', { name: taskListName })}
        </p>
        <p className={styles.warning}>{t('common.cannotUndo')}</p>
      </div>

      {state?.error && <ErrorHighlight message={state.error} />}
    </Modal>
  );
}
