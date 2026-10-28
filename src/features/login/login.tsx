'use client';

import Image from 'next/image';
import { startTransition, useActionState, useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import styles from './login.module.css';
import type { LoginActionState } from './api/login.action';
import { loginAction } from './api/login.action';
import { useFillFormStubsHotkey } from '@/src/shared/lib/fill-form-stubs';
import { CircleLoader } from '@/src/shared/ui/components/circle-loader';
import { ErrorHighlight } from '@/src/shared/ui/components/error-highlight';

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
  const t = useTranslations();
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
              <label htmlFor="email">{t('login.email')}</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email', {
                  required: t('validation.emailRequired'),
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: t('validation.emailInvalid'),
                  },
                })}
                className={styles.input}
                placeholder="name@example.com"
              />
              {errors.email && (
                <div className={styles.fieldError}>
                  <ErrorHighlight message={errors.email.message} />
                </div>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password">{t('login.password')}</label>
              <div className={styles.passwordField}>
                <input
                  id="password"
                  type={isPasswordVisible ? 'text' : 'password'}
                  autoComplete="current-password"
                  {...register('password', {
                    required: t('validation.passwordRequired'),
                    minLength: {
                      value: 8,
                      message: t('validation.passwordMinLength'),
                    },
                  })}
                  className={styles.input}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() =>
                    setIsPasswordVisible((prev: boolean) => !prev)
                  }
                  aria-label={
                    isPasswordVisible ? t('login.hidePassword') : t('login.showPassword')
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
                      isPasswordVisible ? t('login.hidePassword') : t('login.showPassword')
                    }
                    width={20}
                    height={20}
                  />
                </button>
              </div>
              {errors.password && (
                <div className={styles.fieldError}>
                  <ErrorHighlight message={errors.password.message} />
                </div>
              )}
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
            {isPending ? t('login.loading') : t('login.submit')}
          </button>
        </form>
      </div>
    </CircleLoader>
  );
}
