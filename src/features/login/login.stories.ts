import { expect, userEvent, within } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LoginForm } from "./login";
import { errorMessages } from "@/src/shared/config/error";

const meta: Meta<typeof LoginForm> = {
  title: "Features/LoginForm",
  component: LoginForm,
  tags: ["autodocs"],
  args: {
    stubCredentials: {
      email: "demo@example.com",
      password: "password123",
    },
  },
};

type Story = StoryObj<typeof LoginForm>;

export const Default: Story = {};

export const RequiredFields: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Отправка пустой формы. Валидация обязательных полей и отображение сообщений ошибок: Email обязателен и Пароль обязателен.",
      },
      story: { autoplay: true },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "Войти" }));

    await expect(
      canvas.getByText(errorMessages.validation.emailRequired),
    ).toBeInTheDocument();
    await expect(
      canvas.getByText(errorMessages.validation.passwordRequired),
    ).toBeInTheDocument();
  },
};

export const InvalidEmail: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Ввод невалидного email приводит к отображению сообщения ошибки: Неверный формат email.",
      },
      story: { autoplay: true },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(
      canvas.getByLabelText("Электронная почта"),
      "user@localhost",
    );
    await userEvent.type(canvas.getByLabelText("Пароль"), "password123");
    await userEvent.click(canvas.getByRole("button", { name: "Войти" }));

    await expect(
      canvas.getByText(errorMessages.validation.emailInvalid),
    ).toBeInTheDocument();
  },
};

export const ShortPassword: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Валидный email и пароль короче 8 символов приводит к отображению сообщения ошибки: Минимум 8 символов.",
      },
      story: { autoplay: true },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(
      canvas.getByLabelText("Электронная почта"),
      "demo@example.com",
    );
    await userEvent.type(canvas.getByLabelText("Пароль"), "short");
    await userEvent.click(canvas.getByRole("button", { name: "Войти" }));

    await expect(
      canvas.getByText(errorMessages.validation.passwordMinLength),
    ).toBeInTheDocument();
  },
};

export default meta;
