"use client";

import type { SubmitHandler} from "react-hook-form";
import { useForm } from "react-hook-form";
import { startTransition, useActionState, useEffect } from "react";
import type { AddTaskActionState } from "./api/add-task.action";
import { addTaskAction } from "./api/add-task.action";
import styles from "./add-task-modal.module.css";
import type { TaskPriority, TaskState } from "@/src/entities/task";
import {
  TASK_PRIORITIES,
  TASK_PRIORITY_LABELS,
  TASK_STATE_LABELS,
  TASK_STATES,
} from "@/src/entities/task";
import { errorMessages } from "@/src/shared/config/error";
import { useFillFormStubsHotkey } from "@/src/shared/lib/fill-form-stubs";
import { Modal } from "@/src/shared/ui/components/modal";
import { ErrorHighlight } from "@/src/shared/ui/components/error-highlight";

type AddTaskModalProps = {
  isOpen: boolean;
  taskListId: string;
  onClose: () => void;
};

type AddTaskFormData = {
  name: string;
  description: string;
  state: TaskState;
  priority: TaskPriority;
  dueDate: string;
};

function getTomorrowDateTimeLocal(): string {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(12, 0, 0, 0);

  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

function getAddTaskFormStubs(): Partial<AddTaskFormData> {
  return {
    name: "Подготовить отчёт",
    description: "Собрать данные за неделю и оформить презентацию",
    dueDate: getTomorrowDateTimeLocal(),
  };
}

export function AddTaskModal({
  isOpen,
  taskListId,
  onClose,
}: AddTaskModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<AddTaskFormData>({
    defaultValues: {
      name: "",
      description: "",
      state: "new",
      priority: 2,
      dueDate: "",
    },
  });

  useFillFormStubsHotkey({
    getValues,
    setValue,
    stubs: getAddTaskFormStubs,
    enabled: isOpen,
  });
  const [state, formAction, isPending] = useActionState<
    AddTaskActionState,
    FormData
  >(addTaskAction, null);

  useEffect(() => {
    if (isOpen) {
      reset({
        name: "",
        description: "",
        state: "new",
        priority: 2,
        dueDate: "",
      });
    }
  }, [isOpen, reset]);

  useEffect(() => {
    if (state?.success) {
      onClose();
    }
  }, [state, onClose]);

  const onSubmit: SubmitHandler<AddTaskFormData> = (data) => {
    startTransition(() => {
      const formData = new FormData();
      formData.append("taskListId", taskListId);
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("state", data.state);
      formData.append("priority", String(data.priority));
      formData.append("dueDate", data.dueDate);
      formAction(formData);
    });
  };

  return (
    <Modal isOpen={isOpen} title="Добавить задачу" onClose={onClose}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.inputGroup}>
          <label htmlFor="add-task-name">Название</label>
          <input
            id="add-task-name"
            className={styles.input}
            placeholder="Например, Подготовить отчёт"
            {...register("name", { required: errorMessages.validation.nameRequired })}
          />
          {errors.name && <ErrorHighlight message={errors.name.message} />}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="add-task-description">Описание</label>
          <textarea
            id="add-task-description"
            className={styles.textarea}
            placeholder="Необязательно"
            {...register("description")}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.inputGroup}>
            <label htmlFor="add-task-state">Статус</label>
            <select
              id="add-task-state"
              className={styles.select}
              {...register("state", { required: true })}
            >
              {TASK_STATES.map((taskState) => (
                <option key={taskState} value={taskState}>
                  {TASK_STATE_LABELS[taskState]}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="add-task-priority">Приоритет</label>
            <select
              id="add-task-priority"
              className={styles.select}
              {...register("priority", { valueAsNumber: true, required: true })}
            >
              {TASK_PRIORITIES.map((priority) => (
                <option key={priority} value={priority}>
                  {TASK_PRIORITY_LABELS[priority]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="add-task-due-date">Дедлайн</label>
          <input
            id="add-task-due-date"
            type="datetime-local"
            className={styles.input}
            {...register("dueDate", {
              required: errorMessages.validation.dueDateRequired,
            })}
          />
          {errors.dueDate && (
            <ErrorHighlight message={errors.dueDate.message} />
          )}
        </div>

        {state?.error && <ErrorHighlight message={state.error} />}

        <button type="submit" disabled={isPending} className={styles.btnSubmit}>
          {isPending ? "Создание..." : "Создать"}
        </button>
      </form>
    </Modal>
  );
}
