"use client";

import { startTransition, useActionState, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { editTaskAction, EditTaskActionState } from "./api/edit-task.action";
import styles from "./edit-task-modal.module.css";
import {
  Task,
  TASK_PRIORITIES,
  TASK_PRIORITY_LABELS,
  TASK_STATE_LABELS,
  TASK_STATES,
  TaskPriority,
  TaskState,
  isTaskPriority,
  isTaskState,
} from "@/src/entities/task";
import { Modal } from "@/src/shared/ui/components/modal";
import { ErrorHighlight } from "@/src/shared/ui/components/error-highlight";

type EditTaskModalProps = {
  isOpen: boolean;
  taskListId: string;
  task: Task | null;
  onClose: () => void;
};

type EditTaskFormData = {
  name: string;
  description: string;
  state: TaskState;
  priority: TaskPriority;
  dueDate: string;
};

function toDateTimeLocalValue(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

export function EditTaskModal({
  isOpen,
  taskListId,
  task,
  onClose,
}: EditTaskModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditTaskFormData>();

  const [state, formAction, isPending] = useActionState<
    EditTaskActionState,
    FormData
  >(editTaskAction, null);

  useEffect(() => {
    if (isOpen && task) {
      reset({
        name: task.name,
        description: task.description,
        state: isTaskState(task.state) ? task.state : "new",
        priority: isTaskPriority(task.priority) ? task.priority : 2,
        dueDate: toDateTimeLocalValue(task.dueDate),
      });
    }
  }, [isOpen, reset, task]);

  const onSubmit: SubmitHandler<EditTaskFormData> = (data) => {
    if (!task) {
      return;
    }

    startTransition(() => {
      const formData = new FormData();
      formData.append("id", task.id);
      formData.append("taskListId", taskListId);
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("state", data.state);
      formData.append("priority", String(data.priority));
      formData.append("dueDate", data.dueDate);
      formAction(formData);
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} title="Редактировать задачу" onClose={onClose}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.inputGroup}>
          <label htmlFor="edit-task-name">Название</label>
          <input
            id="edit-task-name"
            className={styles.input}
            placeholder="Название задачи"
            {...register("name", { required: "Название обязательно" })}
          />
          {errors.name && <ErrorHighlight message={errors.name.message} />}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="edit-task-description">Описание</label>
          <textarea
            id="edit-task-description"
            className={styles.textarea}
            placeholder="Краткое описание"
            {...register("description")}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.inputGroup}>
            <label htmlFor="edit-task-state">Статус</label>
            <select
              id="edit-task-state"
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
            <label htmlFor="edit-task-priority">Приоритет</label>
            <select
              id="edit-task-priority"
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
          <label htmlFor="edit-task-due-date">Дедлайн</label>
          <input
            id="edit-task-due-date"
            type="datetime-local"
            className={styles.input}
            {...register("dueDate", { required: "Дедлайн обязателен" })}
          />
          {errors.dueDate && (
            <ErrorHighlight message={errors.dueDate.message} />
          )}
        </div>

        {state?.error && <ErrorHighlight message={state.error} />}

        <button type="submit" disabled={isPending} className={styles.btnSubmit}>
          {isPending ? "Сохранение..." : "Сохранить"}
        </button>
      </form>
    </Modal>
  );
}
