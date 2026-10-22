"use client";

import { startTransition, useActionState, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  renameTaskListAction,
  RenameTaskListActionState,
} from "./api/rename-task-list.action";
import styles from "./rename-task-list-modal.module.css";
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

  const onSubmit: SubmitHandler<RenameTaskListFormData> = (
    data: RenameTaskListFormData,
  ) => {
    startTransition(() => {
      const formData = new FormData();
      formData.append("id", taskListId);
      formData.append("name", data.name);
      formAction(formData);
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} title="Переименовать список" onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.inputGroup}>
          <label htmlFor="rename-task-list-name">Новое имя списка</label>
          <input
            id="rename-task-list-name"
            {...register("name", {
              required: "Имя обязательно",
            })}
            className={styles.input}
            placeholder="Имя списка"
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
