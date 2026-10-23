"use client";

import { startTransition, useActionState, useEffect } from "react";
import type { SubmitHandler} from "react-hook-form";
import { useForm } from "react-hook-form";
import type {
  RenameTaskListActionState} from "./api/rename-task-list.action";
import {
  renameTaskListAction
} from "./api/rename-task-list.action";
import styles from "./rename-task-list-modal.module.css";
import { errorMessages } from "@/src/shared/config";
import { Modal } from "@/src/shared/ui/components/modal";
import { ErrorHighlight } from "@/src/shared/ui/components/error-highlight";

type RenameTaskListModalProps = {
  isOpen: boolean;
  taskListId: string;
  currentName: string;
  onClose: () => void;
};

type RenameTaskListFormData = {
  name: string;
};

export function RenameTaskListModal({
  isOpen,
  taskListId,
  currentName,
  onClose,
}: RenameTaskListModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RenameTaskListFormData>({
    defaultValues: { name: currentName },
  });

  const [state, formAction, isPending] = useActionState<
    RenameTaskListActionState,
    FormData
  >(renameTaskListAction, null);

  useEffect(() => {
    if (isOpen) {
      reset({ name: currentName });
    }
  }, [currentName, isOpen, reset]);

  useEffect(() => {
    if (state?.success) {
      onClose();
    }
  }, [state, onClose]);

  const onSubmit: SubmitHandler<RenameTaskListFormData> = (
    data: RenameTaskListFormData,
  ) => {
    startTransition(() => {
      const formData = new FormData();
      formData.append("id", taskListId);
      formData.append("name", data.name);
      formAction(formData);
    });
  };

  return (
    <Modal isOpen={isOpen} title="Переименовать список" onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.inputGroup}>
          <label htmlFor="rename-task-list-name">Название</label>
          <input
            id="rename-task-list-name"
            {...register("name", {
              required: errorMessages.validation.nameRequired,
            })}
            className={styles.input}
          />
          {errors.name && <ErrorHighlight message={errors.name.message} />}
        </div>

        {state?.error && <ErrorHighlight message={state.error} />}

        <button type="submit" disabled={isPending} className={styles.btnSubmit}>
          {isPending ? "Сохранение..." : "Сохранить"}
        </button>
      </form>
    </Modal>
  );
}
