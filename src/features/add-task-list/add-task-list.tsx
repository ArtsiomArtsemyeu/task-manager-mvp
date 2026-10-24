'use client';

import { startTransition, useActionState, useEffect } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import type { AddTaskListActionState } from './api/add-task-list.action';
import { addTaskListAction } from './api/add-task-list.action';
import styles from './add-task-list.module.css';
import { errorMessages } from '@/src/shared/config/error';
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
      Object.entries(data).forEach(([key, val]) => formData.append(key, val));
      formAction(formData);
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Добавить новый список задач"
      onClose={onClose}
      action={
        <button
          type="submit"
          form="add-task-list-form"
          disabled={isPending}
          className={styles.btnSubmit}
        >
          {isPending ? 'Загрузка...' : 'Создать'}
        </button>
      }
    >
      <form id="add-task-list-form" onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.inputGroup}>
          <label htmlFor="add-task-list-name">Название</label>
          <input
            id="add-task-list-name"
            {...register('name', {
              required: errorMessages.validation.nameRequired,
            })}
            className={styles.input}
            placeholder="Например, Работа"
          />
          {errors.name && <ErrorHighlight message={errors.name.message} />}
        </div>

        {state?.error && <ErrorHighlight message={state.error} />}
      </form>
    </Modal>
  );
}
