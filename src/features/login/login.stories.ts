import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Login } from './login';
import { errorMessages } from '@/src/shared/config/error';

const VALID_EMAIL = 'storybook@example.com';
const VALID_PASSWORD = 'Storybook123!';

const meta: Meta<typeof Login> = {
  title: 'Features/Login',
  component: Login,
  tags: ['autodocs'],
  args: {
    action: fn(() => Promise.resolve(null)),
  },
};

type Story = StoryObj<typeof Login>;

async function fillAndSubmit(
  canvasElement: HTMLElement,
  email: string,
  password: string,
) {
  const canvas = within(canvasElement);
  await userEvent.type(canvas.getByLabelText('Электронный адрес'), email);
  await userEvent.type(canvas.getByLabelText('Пароль'), password);
  await userEvent.click(canvas.getByRole('button', { name: 'Войти' }));
}

export const Default: Story = {};

export const RequiredFields: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Отправка пустой формы. Валидация обязательных полей: Email обязателен и Пароль обязателен. Action не вызывается.',
      },
      story: { autoplay: true },
    },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Войти' }));

    await expect(
      canvas.getByLabelText('Электронный адрес'),
    ).toHaveAccessibleDescription(errorMessages.validation.emailRequired);
    await expect(canvas.getByLabelText('Пароль')).toHaveAccessibleDescription(
      errorMessages.validation.passwordRequired,
    );
    await expect(args.action).not.toHaveBeenCalled();
  },
};

export const InvalidEmail: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Невалидный email приводит к сообщению: Неверный формат email. Action не вызывается.',
      },
      story: { autoplay: true },
    },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await fillAndSubmit(canvasElement, 'user@localhost', VALID_PASSWORD);

    await expect(
      canvas.getByLabelText('Электронный адрес'),
    ).toHaveAccessibleDescription(errorMessages.validation.emailInvalid);
    await expect(args.action).not.toHaveBeenCalled();
  },
};

export const ShortPassword: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Пароль короче 8 символов приводит к сообщению: Минимум 8 символов. Action не вызывается.',
      },
      story: { autoplay: true },
    },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await fillAndSubmit(canvasElement, VALID_EMAIL, 'short');

    await expect(canvas.getByLabelText('Пароль')).toHaveAccessibleDescription(
      errorMessages.validation.passwordMinLength,
    );
    await expect(args.action).not.toHaveBeenCalled();
  },
};

export const InvalidCredentials: Story = {
  args: {
    action: fn(() =>
      Promise.resolve({
        error: errorMessages.error.invalidCredentials,
      }),
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Валидная форма и отказ сервера. Отображается ошибка: Неверный email или пароль.',
      },
      story: { autoplay: true },
    },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await fillAndSubmit(canvasElement, VALID_EMAIL, VALID_PASSWORD);

    await waitFor(async () => await expect(args.action).toHaveBeenCalledOnce());
    await expect(
      canvas.getByText(errorMessages.error.invalidCredentials),
    ).toBeInTheDocument();
  },
};

export const SuccessfulSubmit: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Валидная форма успешно отправляется: action вызывается с email и password.',
      },
      story: { autoplay: true },
    },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await fillAndSubmit(canvasElement, VALID_EMAIL, VALID_PASSWORD);

    await waitFor(async () => await expect(args.action).toHaveBeenCalledOnce());

    const actionMock = args.action as ReturnType<typeof fn>;
    const formData = actionMock.mock.calls[0]?.[1] as FormData;
    await expect(formData.get('email')).toBe(VALID_EMAIL);
    await expect(formData.get('password')).toBe(VALID_PASSWORD);
    await expect(
      canvas.queryByText(errorMessages.error.invalidCredentials),
    ).not.toBeInTheDocument();
    await expect(
      canvas.getByRole('button', { name: 'Войти' }),
    ).toBeInTheDocument();
  },
};

export const TogglePasswordVisibility: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Клик по глазику показывает и скрывает введённый пароль.',
      },
      story: { autoplay: true },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const passwordInput = canvas.getByLabelText('Пароль');

    await userEvent.type(passwordInput, VALID_PASSWORD);
    await expect(passwordInput).toHaveAttribute('type', 'password');

    await userEvent.click(
      canvas.getByRole('button', { name: 'Показать пароль' }),
    );
    await expect(passwordInput).toHaveAttribute('type', 'text');
    await expect(
      canvas.getByRole('button', { name: 'Скрыть пароль' }),
    ).toBeInTheDocument();

    await userEvent.click(
      canvas.getByRole('button', { name: 'Скрыть пароль' }),
    );
    await expect(passwordInput).toHaveAttribute('type', 'password');
  },
};

export default meta;
