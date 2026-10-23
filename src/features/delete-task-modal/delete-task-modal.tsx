"use client";

import { startTransition, useActionState } from "react";
import {
  deleteTaskAction,
  DeleteTaskActionState,
} from "./api/delete-task.action";
import styles from "./delete-task-modal.module.css";
import { Modal } from "@/src/shared/ui/components/modal";
import { ErrorHighlight } from "@/src/shared/ui/components/error-highlight";

type DeleteTaskModalProps = {
  isOpen: boolean;
  taskListId: string;
  taskId: string;
  taskName: string;
  redirectTo?: string;
  onClose: () => void;
};

export function DeleteTaskModal({
  isOpen,
  taskListId,
  taskId,
  taskName,
  redirectTo,
  onClose,
}: DeleteTaskModalProps) {
  const [state, formAction, isPending] = useActionState<
    DeleteTaskActionState,
    FormData
  >(deleteTaskAction, null);

  const onConfirm = () => {
    startTransition(() => {
      const formData = new FormData();
      formData.append("id", taskId);
      formData.append("taskListId", taskListId);
      if (redirectTo) {
        formData.append("redirectTo", redirectTo);
      }
      formAction(formData);
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} title="Удалить задачу" onClose={onClose}>
      <div className={styles.message}>
        <p className={styles.messageText}>
          Вы уверены, что хотите удалить задачу «{taskName}»?
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
