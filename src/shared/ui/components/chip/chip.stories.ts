import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Chip } from './chip';

const meta: Meta<typeof Chip> = {
  title: 'Shared/Chip',
  component: Chip,
  tags: ['autodocs'],
};

type Story = StoryObj<typeof Chip>;

export const Red: Story = {
  args: {
    label: 'Срочно',
    color: 'red',
  },
};

export const Yellow: Story = {
  args: {
    label: 'Скоро',
    color: 'yellow',
  },
};

export default meta;
