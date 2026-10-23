"use client";

import { startTransition, useActionState } from "react";
import type { SubmitHandler} from "react-hook-form";
import { useForm } from "react-hook-form";
import styles from "./login.module.css";
import type { LoginActionState } from "./api/login.action";
import { loginAction } from "./api/login.action";
import { errorMessages } from "@/src/shared/config";
import { useFillFormStubsHotkey } from "@/src/shared/lib/fill-form-stubs";
import { CircleLoader } from "@/src/shared/ui/components/circle-loader";
import { ErrorHighlight } from "@/src/shared/ui/components/error-highlight";

type LoginFormData = {
  email: string;
  password: string;
};

type LoginFormProps = {
  stubCredentials: LoginFormData;
};

export function LoginForm({ stubCredentials }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>();

  useFillFormStubsHotkey({
    getValues,
    setValue,
    stubs: stubCredentials,
  });

  const [state, formAction, isPending] = useActionState<
    LoginActionState,
    FormData
  >(loginAction, null);

  const onSubmit: SubmitHandler<LoginFormData> = (data: LoginFormData) => {
    startTransition(() => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, val]) =>
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
              <label htmlFor="email">Электронная почта</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email", {
                  required: errorMessages.validation.emailRequired,
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: errorMessages.validation.emailInvalid,
                  },
                })}
                className={styles.input}
                placeholder="name@example.com"
              />
              {errors.email && (
                <ErrorHighlight message={errors.email.message} />
              )}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password">Пароль</label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register("password", {
                  required: errorMessages.validation.passwordRequired,
                  minLength: {
                    value: 8,
                    message: errorMessages.validation.passwordMinLength,
                  },
                })}
                className={styles.input}
              />
              {errors.password && (
                <ErrorHighlight message={errors.password.message} />
              )}
            </div>
            <div>
              {state?.error && <ErrorHighlight message={state.error} />}
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className={styles.btnSubmit}
          >
            {isPending ? "Загрузка..." : "Войти"}
          </button>
        </form>
      </div>
    </CircleLoader>
  );
}
