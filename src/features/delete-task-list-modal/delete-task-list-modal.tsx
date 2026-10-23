"use client";

import { startTransition, useActionState } from "react";
import {
  deleteTaskListAction,
  DeleteTaskListActionState,
} from "./api/delete-task-list.action";
import styles from "./delete-task-list-modal.module.css";
import { Modal } from "@/src/shared/ui/components/modal";
import { ErrorHighlight } from "@/src/shared/ui/components/error-highlight";

type DeleteTaskListModalProps = {
  isOpen: boolean;
  taskListId: string;
  taskListName: string;
  onClose: () => void;
};

export function DeleteTaskListModal({
  isOpen,
  taskListId,
  taskListName,
  onClose,
}: DeleteTaskListModalProps) {
  const [state, formAction, isPending] = useActionState<
    DeleteTaskListActionState,
    FormData
  >(deleteTaskListAction, null);

  const onConfirm = () => {
    startTransition(() => {
      const formData = new FormData();
      formData.append("id", taskListId);
      formAction(formData);
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} title="Удалить список" onClose={onClose}>
      <div className={styles.message}>
        <p className={styles.messageText}>
          Вы уверены, что хотите удалить список «{taskListName}»?
        </p>
        <p className={styles.warning}>Это действие нельзя отменить.</p>
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
          {isPending ? "Удаление..." : "Удалить"}
        </button>
      </div>
    </Modal>
  );
}
