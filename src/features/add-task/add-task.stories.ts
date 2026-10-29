import { expect, fn, userEvent } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { AddTask } from './add-task';
import { errorMessages } from '@/src/shared/config/error';
import { getPortalBody } from '@/src/shared/lib/storybook';

const meta: Meta<typeof AddTask> = {
  title: 'Features/AddTask',
  component: AddTask,
  tags: ['autodocs'],
  args: {
    isOpen: true,
    taskListId: 'list-1',
  },
  parameters: {
    layout: 'fullscreen',
  },
};

type Story = StoryObj<typeof AddTask>;

export const Default: Story = {
  args: {
    onClose: fn(),
  },
};

export const RequiredFields: Story = {
  args: {
    onClose: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Отправка пустой формы. Валидация обязательных полей и отображение сообщений ошибок: Название обязательно и Дедлайн обязателен.',
      },
      story: { autoplay: true },
    },
  },
  play: async ({ canvasElement }) => {
    const body = getPortalBody(canvasElement);

    await userEvent.click(body.getByRole('button', { name: 'Создать' }));

    await expect(body.getByLabelText('Название')).toHaveAccessibleDescription(
      errorMessages.validation.nameRequired,
    );
    await expect(body.getByLabelText('Дедлайн')).toHaveAccessibleDescription(
      errorMessages.validation.dueDateRequired,
    );
  },
};

export default meta;
