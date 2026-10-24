import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CircleLoader } from './circle-loader';

const meta: Meta<typeof CircleLoader> = {
  title: 'Shared/CircleLoader',
  component: CircleLoader,
  tags: ['autodocs'],
};

type Story = StoryObj<typeof CircleLoader>;

export const Loading: Story = {
  args: {
    show: true,
    children: <p>Загрузка данных…</p>,
  },
};

export const Hidden: Story = {
  args: {
    show: false,
    children: <p>Контент без лоадера</p>,
  },
};

export default meta;
