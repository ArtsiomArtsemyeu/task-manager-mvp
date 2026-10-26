'use client';

import { startTransition, useActionState, useEffect } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import type { RenameTaskListActionState } from './api/rename-task-list.action';
import { renameTaskListAction } from './api/rename-task-list.action';
import styles from './rename-task-list.module.css';
import { Modal } from '@/src/shared/ui/components/modal';
import { ErrorHighlight } from '@/src/shared/ui/components/error-highlight';

type RenameTaskListProps = {
  isOpen: boolean;
  taskListId: string;
  currentName: string;
  onClose: () => void;
};

type RenameTaskListFormData = {
  name: string;
};

export function RenameTaskList({
  isOpen,
  taskListId,
  currentName,
  onClose,
}: RenameTaskListProps) {
  const t = useTranslations();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RenameTaskListFormData>({
    defaultValues: { name: currentName },
  });

  const [state, formAction, isPending] = useActionState<
    RenameTaskListActionState,
    FormData
  >(renameTaskListAction, null);

  useEffect(() => {
    if (isOpen) {
      reset({ name: currentName });
    }
  }, [currentName, isOpen, reset]);

  useEffect(() => {
    if (state?.success) {
      onClose();
    }
  }, [state, onClose]);

  const onSubmit: SubmitHandler<RenameTaskListFormData> = (
    data: RenameTaskListFormData,
  ) => {
    startTransition(() => {
      const formData = new FormData();
      Object.entries({
        id: taskListId,
        ...data,
      }).forEach(([key, val]: [string, string]) =>
        formData.append(key, val),
      );
      formAction(formData);
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      title={t('renameTaskList.title')}
      onClose={onClose}
      action={
        <button
          type="submit"
          form="rename-task-list-form"
          disabled={isPending}
          className={styles.btnSubmit}
        >
          {isPending ? t('common.saving') : t('common.save')}
        </button>
      }
    >
      <form id="rename-task-list-form" onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.inputGroup}>
          <label htmlFor="rename-task-list-name">{t('common.name')}</label>
          <input
            id="rename-task-list-name"
            {...register('name', {
              required: t('validation.nameRequired'),
            })}
            className={styles.input}
          />
          {errors.name && <ErrorHighlight message={errors.name.message} />}
        </div>

        {state?.error && <ErrorHighlight message={state.error} />}
      </form>
    </Modal>
  );
}
