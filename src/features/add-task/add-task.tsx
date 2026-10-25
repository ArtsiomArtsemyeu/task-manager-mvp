'use client';

import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { startTransition, useActionState, useEffect } from 'react';
import type { AddTaskActionState } from './api/add-task.action';
import { addTaskAction } from './api/add-task.action';
import styles from './add-task.module.css';
import type { TaskPriority, TaskState } from '@/src/entities/task';
import {
  TASK_PRIORITIES,
  TASK_PRIORITY_LABELS,
  TASK_STATE_LABELS,
  TASK_STATES,
  getTomorrowDateTimeLocal,
} from '@/src/entities/task';
import { errorMessages } from '@/src/shared/config/error';
import { useFillFormStubsHotkey } from '@/src/shared/lib/fill-form-stubs';
import { Modal } from '@/src/shared/ui/components/modal';
import { ErrorHighlight } from '@/src/shared/ui/components/error-highlight';

type AddTaskProps = {
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

function getAddTaskFormStubs(): Partial<AddTaskFormData> {
  return {
    name: 'Подготовить отчёт',
    description: 'Собрать данные за неделю и оформить презентацию',
    dueDate: getTomorrowDateTimeLocal(),
  };
}

export function AddTask({ isOpen, taskListId, onClose }: AddTaskProps) {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<AddTaskFormData>({
    defaultValues: {
      name: '',
      description: '',
      state: 'new',
      priority: 1,
      dueDate: '',
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
        name: '',
        description: '',
        state: 'new',
        priority: 1,
        dueDate: '',
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
      Object.entries({
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
      title="Добавить задачу"
      onClose={onClose}
      action={
        <button
          type="submit"
          form="add-task-form"
          disabled={isPending}
          className={styles.btnSubmit}
        >
          {isPending ? 'Создание...' : 'Создать'}
        </button>
      }
    >
      <form
        id="add-task-form"
        className={styles.form}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className={styles.inputGroup}>
          <label htmlFor="add-task-name">Название</label>
          <input
            id="add-task-name"
            className={styles.input}
            placeholder="Например, Подготовить отчёт"
            {...register('name', {
              required: errorMessages.validation.nameRequired,
            })}
          />
          {errors.name && <ErrorHighlight message={errors.name.message} />}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="add-task-description">Описание</label>
          <textarea
            id="add-task-description"
            className={styles.textarea}
            placeholder="Необязательно"
            {...register('description')}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.inputGroup}>
            <label htmlFor="add-task-state">Статус</label>
            <select
              id="add-task-state"
              className={styles.select}
              {...register('state', { required: true })}
            >
              {TASK_STATES.map((taskState: TaskState) => (
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
              {...register('priority', { valueAsNumber: true, required: true })}
            >
              {TASK_PRIORITIES.map((priority: TaskPriority) => (
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
            {...register('dueDate', {
              required: errorMessages.validation.dueDateRequired,
            })}
          />
          {errors.dueDate && (
            <ErrorHighlight message={errors.dueDate.message} />
          )}
        </div>

        {state?.error && <ErrorHighlight message={state.error} />}
      </form>
    </Modal>
  );
}
