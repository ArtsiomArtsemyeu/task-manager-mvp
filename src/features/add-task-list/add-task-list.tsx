'use client';

import { startTransition, useActionState, useEffect } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import type { AddTaskListActionState } from './api/add-task-list.action';
import { addTaskListAction } from './api/add-task-list.action';
import styles from './add-task-list.module.css';
import { useFillFormStubsHotkey } from '@/src/shared/lib/fill-form-stubs';
import { Modal } from '@/src/shared/ui/components/modal';
import { ErrorHighlight } from '@/src/shared/ui/components/error-highlight';

type AddTaskListProps = {
  isOpen: boolean;
  onClose: () => void;
};

type AddTaskListFormData = {
  name: string;
};

const ADD_TASK_LIST_FORM_STUBS: AddTaskListFormData = {
  name: 'Рабочие задачи',
};

export function AddTaskList({ isOpen, onClose }: AddTaskListProps) {
  const t = useTranslations();
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<AddTaskListFormData>({
    defaultValues: { name: '' },
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
    if (isOpen) {
      reset({ name: '' });
    }
  }, [isOpen, reset]);

  useEffect(() => {
    if (state?.success) {
      onClose();
    }
  }, [state, onClose]);

  const onSubmit: SubmitHandler<AddTaskListFormData> = (
    data: AddTaskListFormData,
  ) => {
    startTransition(() => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, val]: [string, string]) =>
        formData.append(key, val),
      );
      formAction(formData);
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      title={t('addTaskList.title')}
      onClose={onClose}
      action={
        <button
          type="submit"
          form="add-task-list-form"
          disabled={isPending}
          className={styles.btnSubmit}
        >
          {isPending ? t('addTaskList.loading') : t('addTaskList.create')}
        </button>
      }
    >
      <form id="add-task-list-form" onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.inputGroup}>
          <label htmlFor="add-task-list-name">{t('common.name')}</label>
          <input
            id="add-task-list-name"
            {...register('name', {
              required: t('validation.nameRequired'),
            })}
            className={styles.input}
            placeholder={t('addTaskList.placeholder')}
          />
          {errors.name && <ErrorHighlight message={errors.name.message} />}
        </div>

        {state?.error && <ErrorHighlight message={state.error} />}
      </form>
    </Modal>
  );
}
