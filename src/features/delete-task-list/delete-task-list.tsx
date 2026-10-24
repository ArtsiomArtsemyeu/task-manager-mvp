'use client';

import { startTransition, useActionState, useEffect } from 'react';
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
      formData.append('id', taskListId);
      formAction(formData);
    });
  };

  return (
    <Modal isOpen={isOpen} title="Удалить ѝпиѝок" onClose={onClose}>
      <div className={styles.message}>
        <p className={styles.messageText}>
          Вы уверены, что хотите удалить ѝпиѝок «{taskListName}»?
        </p>
        <p className={styles.warning}>Это дейѝтвие нельзѝ отменить.</p>
      </div>

      {state?.error && <ErrorHighlight message={state.error} />}

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.btnCancel}
          onClick={onClose}
          disabled={isPending}
        >
          Отмена
        </button>
        <button
          type="button"
          className={styles.btnDanger}
          onClick={onConfirm}
          disabled={isPending}
        >
          {isPending ? 'Удаление...' : 'Удалить'}
        </button>
      </div>
    </Modal>
  );
}
