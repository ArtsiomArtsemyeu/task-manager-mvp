'use client';

import { startTransition, useActionState, useEffect } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { useLocale, useTranslations } from 'next-intl';
import type { EditTaskActionState } from './api/edit-task.action';
import { editTaskAction } from './api/edit-task.action';
import styles from './edit-task.module.css';
import type { Task, TaskPriority, TaskState } from '@/src/entities/task';
import {
  TASK_PRIORITIES,
  TASK_STATES,
  isTaskPriority,
  isTaskState,
  toDateTimeLocalValue,
  useTaskLabels,
} from '@/src/entities/task';
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
  const t = useTranslations();
  const locale = useLocale();
  const { stateLabel, priorityLabel } = useTaskLabels();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditTaskFormData>();

  const [state, formAction, isPending] = useActionState<
    EditTaskActionState,
    FormData
  >(
    (prevState, formData) => editTaskAction(locale, prevState, formData),
    null,
  );

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
      title={t('editTask.editTaskTitle')}
      onClose={onClose}
      action={
        <button
          type="submit"
          form="edit-task-form"
          disabled={isPending}
          className={styles.btnSubmit}
        >
          {isPending ? t('editTask.savingTask') : t('editTask.saveTask')}
        </button>
      }
    >
      <form
        id="edit-task-form"
        className={styles.form}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className={styles.inputGroup}>
          <label htmlFor="edit-task-name">{t('editTask.taskName')}</label>
          <Input
            id="edit-task-name"
            placeholder={t('editTask.taskNamePlaceholder')}
            error={errors.name?.message}
            {...register('name', {
              required: t('validation.nameRequired'),
            })}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="edit-task-description">{t('editTask.taskDescription')}</label>
          <textarea
            id="edit-task-description"
            className={styles.textarea}
            placeholder={t('editTask.taskDescriptionPlaceholder')}
            {...register('description')}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.inputGroup}>
            <label htmlFor="edit-task-state">{t('editTask.taskStatus')}</label>
            <Select
              id="edit-task-state"
              {...register('state', { required: true })}
            >
              {TASK_STATES.map((taskState: TaskState) => (
                <option key={taskState} value={taskState}>
                  {stateLabel(taskState)}
                </option>
              ))}
            </Select>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="edit-task-priority">{t('editTask.taskPriority')}</label>
            <Select
              id="edit-task-priority"
              {...register('priority', { valueAsNumber: true, required: true })}
            >
              {TASK_PRIORITIES.map((priority: TaskPriority) => (
                <option key={priority} value={priority}>
                  {priorityLabel(priority)}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="edit-task-due-date">{t('editTask.taskDueDate')}</label>
          <Input
            id="edit-task-due-date"
            type="datetime-local"
            error={errors.dueDate?.message}
            {...register('dueDate', {
              required: t('validation.dueDateRequired'),
            })}
          />
        </div>

        {state?.error && <ErrorHighlight message={t(state.error)} />}
      </form>
    </Modal>
  );
}
