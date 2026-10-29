import { expect, fn, userEvent } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { RenameTaskList } from './rename-task-list';
import { errorMessages } from '@/src/shared/config/error';
import { getPortalBody } from '@/src/shared/lib/storybook';

const meta: Meta<typeof RenameTaskList> = {
  title: 'Features/RenameTaskList',
  component: RenameTaskList,
  tags: ['autodocs'],
  args: {
    isOpen: true,
    taskListId: 'list-1',
    currentName: 'Рабочие задачи',
  },
  parameters: {
    layout: 'fullscreen',
  },
};

type Story = StoryObj<typeof RenameTaskList>;

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
          'Очистка названия и отправка формы. Валидация обязательного поля и отображение сообщения ошибки: Название обязательно.',
      },
      story: { autoplay: true },
    },
  },
  play: async ({ canvasElement }) => {
    const body = getPortalBody(canvasElement);
    const nameInput = body.getByLabelText('Название');

    await userEvent.clear(nameInput);
    await userEvent.click(body.getByRole('button', { name: 'Сохранить' }));

    await expect(nameInput).toHaveAccessibleDescription(
      errorMessages.validation.nameRequired,
    );
  },
};

export default meta;
