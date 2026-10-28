import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Select } from './select';

const statusOptions = (
  <>
    <option value="new">Новая</option>
    <option value="in progress">В работе</option>
    <option value="done">Готово</option>
    <option value="overdue">Просрочена</option>
  </>
);

const meta: Meta<typeof Select> = {
  title: 'Shared/Select',
  component: Select,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Статус',
    defaultValue: 'new',
    children: statusOptions,
  },
};

type Story = StoryObj<typeof Select>;

export const Default: Story = {};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export default meta;
