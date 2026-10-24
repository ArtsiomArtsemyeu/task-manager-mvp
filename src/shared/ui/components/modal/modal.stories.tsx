import { fn } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Modal } from './modal';

const meta: Meta<typeof Modal> = {
  title: 'Shared/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    isOpen: true,
    onClose: fn(),
    title: 'Заголовок',
    children: <p>Содержимое модального окна</p>,
  },
};

type Story = StoryObj<typeof Modal>;

export const Default: Story = {};

export const WithAction: Story = {
  args: {
    action: <button type="button">Сохранить</button>,
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
  },
};

export default meta;
