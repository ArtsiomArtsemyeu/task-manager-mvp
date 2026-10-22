"use client";

import { startTransition, useActionState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import styles from "./login.module.css";
import { loginAction, LoginActionState } from "./api/login.action";
import { CircleLoader } from "@/src/shared/ui/components/circle-loader";
import { ErrorHighlight } from "@/src/shared/ui/components/error-highlight";
type LoginFormData = {
  email: string;
  password: string;
};

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const [state, formAction, isPending] = useActionState<
    LoginActionState,
    FormData
  >(loginAction, null);

  const onSubmit: SubmitHandler<LoginFormData> = (data: LoginFormData) => {
    startTransition(() => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, val]) =>
        formData.append(key, val as string),
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
              <label htmlFor="email">Адрес электронной почты</label>
              <input
                {...register("email", {
                  required: "Email обязателен",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Неверный формат email",
                  },
                })}
                className={styles.input}
                placeholder="Адрес электронной почты "
              />
              {errors.email && (
                <ErrorHighlight message={errors.email.message} />
              )}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password">Пароль</label>
              <input
                {...register("password", {
                  required: "Пароль обязателен",
                  minLength: {
                    value: 8,
                    message: "Минимум 8 символов",
                  },
                })}
                className={styles.input}
                placeholder="Пароль"
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
