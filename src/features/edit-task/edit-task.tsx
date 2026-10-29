'use client';

import { startTransition, useActionState, useEffect } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import type { EditTaskActionState } from './api/edit-task.action';
import { editTaskAction } from './api/edit-task.action';
import styles from './edit-task.module.css';
import type { Task, TaskPriority, TaskState } from '@/src/entities/task';
import {
  TASK_PRIORITIES,
  TASK_PRIORITY_LABELS,
  TASK_STATE_LABELS,
  TASK_STATES,
  isTaskPriority,
  isTaskState,
  toDateTimeLocalValue,
} from '@/src/entities/task';
import { errorMessages } from '@/src/shared/config/error';
import { ErrorHighlight } from '@/src/shared/ui/components/error-highlight';
import { Input } from '@/src/shared/ui/components/input';
import { Modal } from '@/src/shared/ui/components/modal';
import { Select } from '@/src/shared/ui/components/select';

type EditTaskProps = {
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

export function EditTask({ isOpen, taskListId, task, onClose }: EditTaskProps) {
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
        state: isTaskState(task.state) ? task.state : 'new',
        priority: isTaskPriority(task.priority) ? task.priority : 2,
        dueDate: toDateTimeLocalValue(task.dueDate),
      });
    }
  }, [isOpen, reset, task]);

  useEffect(() => {
    if (state?.success) {
      onClose();
    }
  }, [state, onClose]);

  const onSubmit: SubmitHandler<EditTaskFormData> = (data) => {
    if (!task) {
      return;
    }

    startTransition(() => {
      const formData = new FormData();
      Object.entries({
        id: task.id,
        taskListId,
        ...data,
      }).forEach(([key, val]: [string, string | number]) =>
        formData.append(key, String(val)),
      );
      formAction(formData);
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Редактировать задачу"
      onClose={onClose}
      action={
        <button
          type="submit"
          form="edit-task-form"
          disabled={isPending}
          className={styles.btnSubmit}
        >
          {isPending ? 'Сохранение...' : 'Сохранить'}
        </button>
      }
    >
      <form
        id="edit-task-form"
        className={styles.form}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className={styles.inputGroup}>
          <label htmlFor="edit-task-name">Название</label>
          <Input
            id="edit-task-name"
            placeholder="Например, Подготовить отчёт"
            error={errors.name?.message}
            {...register('name', {
              required: errorMessages.validation.nameRequired,
            })}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="edit-task-description">Описание</label>
          <textarea
            id="edit-task-description"
            className={styles.textarea}
            placeholder="Необязательно"
            {...register('description')}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.inputGroup}>
            <label htmlFor="edit-task-state">Статус</label>
            <Select
              id="edit-task-state"
              {...register('state', { required: true })}
            >
              {TASK_STATES.map((taskState: TaskState) => (
                <option key={taskState} value={taskState}>
                  {TASK_STATE_LABELS[taskState]}
                </option>
              ))}
            </Select>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="edit-task-priority">Приоритет</label>
            <Select
              id="edit-task-priority"
              {...register('priority', { valueAsNumber: true, required: true })}
            >
              {TASK_PRIORITIES.map((priority: TaskPriority) => (
                <option key={priority} value={priority}>
                  {TASK_PRIORITY_LABELS[priority]}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="edit-task-due-date">Дедлайн</label>
          <Input
            id="edit-task-due-date"
            type="datetime-local"
            error={errors.dueDate?.message}
            {...register('dueDate', {
              required: errorMessages.validation.dueDateRequired,
            })}
          />
        </div>

        {state?.error && <ErrorHighlight message={state.error} />}
      </form>
    </Modal>
  );
}
