import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Input } from './input';

const meta: Meta<typeof Input> = {
  title: 'Shared/Input',
  component: Input,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Название',
    placeholder: 'Введите значение',
  },
};

type Story = StoryObj<typeof Input>;

export const Default: Story = {};

export const WithError: Story = {
  args: {
    error: 'Обязательное поле',
    defaultValue: '',
  },
};

export const WithSuffix: Story = {
  args: {
    type: 'password',
    defaultValue: 'secret',
    suffix: (
      <button type="button" aria-label="Показать пароль">
        Show
      </button>
    ),
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: 'Недоступно',
  },
};

export default meta;
