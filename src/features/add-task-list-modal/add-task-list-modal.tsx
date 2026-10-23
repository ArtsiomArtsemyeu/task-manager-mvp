"use client";

import { startTransition, useActionState, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  addTaskListAction,
  AddTaskListActionState,
} from "./api/add-task-list.action";
import styles from "./add-task-list-modal.module.css";
import { useFillFormStubsHotkey } from "@/src/shared/lib/fill-form-stubs";
import { Modal } from "@/src/shared/ui/components/modal";
import { ErrorHighlight } from "@/src/shared/ui/components/error-highlight";

type AddTaskListModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type AddTaskListFormData = {
  name: string;
};

const ADD_TASK_LIST_FORM_STUBS: AddTaskListFormData = {
  name: "Рабочие задачи",
};

export function AddTaskListModal({ isOpen, onClose }: AddTaskListModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<AddTaskListFormData>({
    defaultValues: { name: "" },
  });

  useFillFormStubsHotkey({
    getValues,
    setValue,
    stubs: ADD_TASK_LIST_FORM_STUBS,
    enabled: isOpen,
  });

  const [state, formAction, isPending] = useActionState<
    AddTaskListActionState,
    FormData
  >(addTaskListAction, null);

  useEffect(() => {
    if (!isOpen) {
      reset({ name: "" });
    }
  }, [isOpen, reset]);

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
            <label htmlFor="add-task-list-name">Название</label>
            <input
              id="add-task-list-name"
              {...register("name", {
                required: "Название обязательно",
              })}
              className={styles.input}
              placeholder="Например, Работа"
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
