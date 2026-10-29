import { expect, fn, userEvent } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { AddTaskList } from './add-task-list';
import { errorMessages } from '@/src/shared/config/error';
import { getPortalBody } from '@/src/shared/lib/storybook';

const meta: Meta<typeof AddTaskList> = {
  title: 'Features/AddTaskList',
  component: AddTaskList,
  tags: ['autodocs'],
  args: {
    isOpen: true,
  },
  parameters: {
    layout: 'fullscreen',
  },
};

type Story = StoryObj<typeof AddTaskList>;

export const Default: Story = {
  args: {
    onClose: fn(),
  },
};

export const RequiredName: Story = {
  args: {
    onClose: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Отправка пустой формы. Валидация обязательного поля и отображение сообщения ошибки: Название обязательно.',
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
  },
};

export default meta;
