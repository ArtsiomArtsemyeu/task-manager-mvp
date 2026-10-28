'use client';

import { startTransition, useActionState, useEffect } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import type { EditTaskActionState } from './api/edit-task.action';
import { editTaskAction } from './api/edit-task.action';
import styles from './edit-task.module.css';
import type { Task, TaskPriority, TaskState } from '@/src/entities/task';
import {
  TASK_PRIORITIES,
  TASK_STATE_MESSAGE_KEYS,
  TASK_STATES,
  isTaskPriority,
  isTaskState,
  toDateTimeLocalValue,
} from '@/src/entities/task';
import { Modal } from '@/src/shared/ui/components/modal';
import { ErrorHighlight } from '@/src/shared/ui/components/error-highlight';
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
  const t = useTranslations();
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
      title={t('editTask.title')}
      onClose={onClose}
      action={
        <button
          type="submit"
          form="edit-task-form"
          disabled={isPending}
          className={styles.btnSubmit}
        >
          {isPending ? t('common.saving') : t('common.save')}
        </button>
      }
    >
      <form
        id="edit-task-form"
        className={styles.form}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className={styles.inputGroup}>
          <label htmlFor="edit-task-name">{t('common.name')}</label>
          <input
            id="edit-task-name"
            className={styles.input}
            placeholder={t('addTask.namePlaceholder')}
            {...register('name', {
              required: t('validation.nameRequired'),
            })}
          />
          {errors.name && <ErrorHighlight message={errors.name.message} />}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="edit-task-description">
            {t('common.description')}
          </label>
          <textarea
            id="edit-task-description"
            className={styles.textarea}
            placeholder={t('common.optional')}
            {...register('description')}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.inputGroup}>
            <label htmlFor="edit-task-state">{t('common.status')}</label>
            <Select
              id="edit-task-state"
              {...register('state', { required: true })}
            >
              {TASK_STATES.map((taskState: TaskState) => (
                <option key={taskState} value={taskState}>
                  {t(`taskState.${TASK_STATE_MESSAGE_KEYS[taskState]}`)}
                </option>
              ))}
            </Select>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="edit-task-priority">{t('common.priority')}</label>
            <Select
              id="edit-task-priority"
              {...register('priority', { valueAsNumber: true, required: true })}
            >
              {TASK_PRIORITIES.map((priority: TaskPriority) => (
                <option key={priority} value={priority}>
                  {t(`taskPriority.${String(priority)}`)}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="edit-task-due-date">{t('common.dueDate')}</label>
          <input
            id="edit-task-due-date"
            type="datetime-local"
            className={styles.input}
            {...register('dueDate', {
              required: t('validation.dueDateRequired'),
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
