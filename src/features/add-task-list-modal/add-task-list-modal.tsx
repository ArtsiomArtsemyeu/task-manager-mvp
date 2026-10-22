"use client";

import { startTransition, useActionState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  addTaskListAction,
  AddTaskListActionState,
} from "./api/add-task-list.action";
import styles from "./add-task-list-modal.module.css";
import { Modal } from "@/src/shared/ui/components/modal";
import { ErrorHighlight } from "@/src/shared/ui/components/error-highlight";

type AddTaskListModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type AddTaskListFormData = {
  name: string;
};

export function AddTaskListModal({ isOpen, onClose }: AddTaskListModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddTaskListFormData>();

  const [state, formAction, isPending] = useActionState<
    AddTaskListActionState,
    FormData
  >(addTaskListAction, null);

  const onSubmit: SubmitHandler<AddTaskListFormData> = (
    data: AddTaskListFormData,
  ) => {
    startTransition(() => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, val]) =>
        formData.append(key, val as string),
      );
      formAction(formData);
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Добавить новый список задач"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Имя для нового списка задач</label>
            <input
              {...register("name", {
                required: "Имя обязателено",
              })}
              className={styles.input}
              placeholder="Имя списка"
            />
            {errors.name && <ErrorHighlight message={errors.name.message} />}
          </div>

          <div>{state?.error && <ErrorHighlight message={state.error} />}</div>
        </div>

        <button type="submit" disabled={isPending} className={styles.btnSubmit}>
          {isPending ? "Загрузка..." : "Создать"}
        </button>
      </form>
    </Modal>
  );
}
