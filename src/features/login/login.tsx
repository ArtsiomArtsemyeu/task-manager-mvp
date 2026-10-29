'use client';

import Image from 'next/image';
import { startTransition, useActionState, useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import styles from './login.module.css';
import type { LoginActionState } from './api/login.action';
import { loginAction } from './api/login.action';
import { errorMessages } from '@/src/shared/config/error';
import { useFillFormStubsHotkey } from '@/src/shared/lib/fill-form-stubs';
import { CircleLoader } from '@/src/shared/ui/components/circle-loader';
import { ErrorHighlight } from '@/src/shared/ui/components/error-highlight';
import { Input } from '@/src/shared/ui/components/input';

type LoginFormData = {
  email: string;
  password: string;
};

type LoginProps = {
  action?: (
    prevState: LoginActionState,
    formData: FormData,
  ) => Promise<LoginActionState> | LoginActionState;
};

const LOGIN_FORM_STUBS: LoginFormData = {
  email: 'admin@example.com',
  password: 'Admin123!',
};

export function Login({ action = loginAction }: LoginProps = {}) {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  useFillFormStubsHotkey({
    getValues,
    setValue,
    stubs: LOGIN_FORM_STUBS,
  });

  const [state, formAction, isPending] = useActionState<
    LoginActionState,
    FormData
  >(action, null);

  const onSubmit: SubmitHandler<LoginFormData> = (data: LoginFormData) => {
    startTransition(() => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, val]: [string, string]) =>
        formData.append(key, val),
      );
      formAction(formData);
    });
  };

  return (
    <CircleLoader show={isPending}>
      <div className={styles.host}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className={styles.inputGroup}>
              <label htmlFor="email">Электронный адрес</label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                error={errors.email?.message}
                {...register('email', {
                  required: errorMessages.validation.emailRequired,
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: errorMessages.validation.emailInvalid,
                  },
                })}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password">Пароль</label>
              <Input
                id="password"
                type={isPasswordVisible ? 'text' : 'password'}
                autoComplete="current-password"
                error={errors.password?.message}
                {...register('password', {
                  required: errorMessages.validation.passwordRequired,
                  minLength: {
                    value: 8,
                    message: errorMessages.validation.passwordMinLength,
                  },
                })}
                suffix={
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() =>
                      setIsPasswordVisible((prev: boolean) => !prev)
                    }
                    aria-label={
                      isPasswordVisible ? 'Скрыть пароль' : 'Показать пароль'
                    }
                    aria-pressed={isPasswordVisible}
                  >
                    <Image
                      src={
                        isPasswordVisible
                          ? '/images/icons/eye-off.svg'
                          : '/images/icons/eye.svg'
                      }
                      alt={
                        isPasswordVisible ? 'Скрыть пароль' : 'Показать пароль'
                      }
                      width={20}
                      height={20}
                    />
                  </button>
                }
              />
            </div>
            <div className={styles.formError} aria-live="polite">
              <ErrorHighlight message={state?.error} />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className={styles.btnSubmit}
          >
            {isPending ? 'Загрузка...' : 'Войти'}
          </button>
        </form>
      </div>
    </CircleLoader>
  );
}
