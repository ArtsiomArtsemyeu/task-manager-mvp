'use client';

import { startTransition, useActionState, useEffect } from 'react';
import type { DeleteTaskActionState } from './api/delete-task.action';
import { deleteTaskAction } from './api/delete-task.action';
import styles from './delete-task.module.css';
import { Modal } from '@/src/shared/ui/components/modal';
import { ErrorHighlight } from '@/src/shared/ui/components/error-highlight';

type DeleteTaskProps = {
  isOpen: boolean;
  taskListId: string;
  taskId: string;
  taskName: string;
  redirectTo?: string;
  onClose: () => void;
};

export function DeleteTask({
  isOpen,
  taskListId,
  taskId,
  taskName,
  redirectTo,
  onClose,
}: DeleteTaskProps) {
  const [state, formAction, isPending] = useActionState<
    DeleteTaskActionState,
    FormData
  >(deleteTaskAction, null);

  useEffect(() => {
    if (state?.success) {
      onClose();
    }
  }, [state, onClose]);

  const onConfirm = () => {
    startTransition(() => {
      const formData = new FormData();
      formData.append('id', taskId);
      formData.append('taskListId', taskListId);
      if (redirectTo) {
        formData.append('redirectTo', redirectTo);
      }
      formAction(formData);
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Удалить задачу"
      onClose={onClose}
      action={
        <button
          type="button"
          className={styles.btnDanger}
          onClick={onConfirm}
          disabled={isPending}
        >
          {isPending ? 'Удаление...' : 'Удалить'}
        </button>
      }
    >
      <div className={styles.message}>
        <p className={styles.messageText}>
          Вы уверены, что хотите удалить задачу «{taskName}»?
        </p>
        <p className={styles.warning}>Это действие нельзя отменить.</p>
      </div>

      {state?.error && <ErrorHighlight message={state.error} />}
    </Modal>
  );
}
